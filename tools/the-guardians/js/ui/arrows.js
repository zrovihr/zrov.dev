// Combat arrows: the one thing on this board that is allowed to be loud.
//
// Geometry is computed from the fixed 5-column grid as percentages. Nothing is measured from
// the DOM, so drawing an arrow never forces layout and the overlay can never disagree with the
// grid underneath it.
//
// The lines live in an SVG with preserveAspectRatio="none", which stretches the coordinate
// space to the lane's real aspect. Straight lines survive that stretch; a triangle would not,
// so arrowheads are CSS elements positioned by percentage instead of SVG markers. That split
// is deliberate. Do not "simplify" it into an SVG marker, it will render skewed.

import { SLOTS_PER_SIDE } from '../engine/constants.js';
import { resolveIntent, enemyOf } from '../engine/combat.js';

const colX = (slot) => ((slot + 0.5) / SLOTS_PER_SIDE) * 100;

function isLethal(attacker, victim) {
  return Math.max(0, attacker.atk - victim.armor) >= victim.hp;
}

// `me` is the side rendered at the bottom of the lane. Its arrows travel upward.
export function laneArrowsHtml(state, laneIdx, me) {
  const lane = state.lanes[laneIdx];
  const foe = enemyOf(me);
  const lines = [];
  const heads = [];

  for (const side of [me, foe]) {
    const goingUp = side === me;
    const fromY = goingUp ? 100 : 0;
    const toY = goingUp ? 0 : 100;

    for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
      const unit = lane.slots[side][slot];
      if (!unit) continue;

      const target = resolveIntent(state, laneIdx, side, slot);
      if (!target) continue;

      const x1 = colX(slot);
      // A tower hit travels straight through the gap rather than converging on lane centre.
      // Converging read as "everything aims at one point", which is not what is happening: the
      // unit is simply unblocked in its own column.
      const x2 = target.kind === 'tower' ? x1 : colX(target.slot);
      const lethal = target.kind === 'unit' && isLethal(unit, target.unit);

      const cls = [
        'arrow',
        goingUp ? 'arrow--own' : 'arrow--foe',
        target.kind === 'tower' ? 'arrow--tower' : '',
        lethal ? 'arrow--lethal' : '',
      ].filter(Boolean).join(' ');

      lines.push(
        `<line class="${cls}" x1="${x1}" y1="${fromY}" x2="${x2}" y2="${toY}" vector-effect="non-scaling-stroke"/>`,
      );

      const headCls = [
        'arrowhead-el',
        goingUp ? 'arrowhead-el--up' : 'arrowhead-el--down',
        lethal ? 'is-lethal' : goingUp ? 'is-own' : 'is-foe',
      ].join(' ');
      heads.push(`<i class="${headCls}" style="left:${x2}%;${goingUp ? 'top:0' : 'bottom:0'}"></i>`);
    }
  }

  return `<svg class="arrows-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines.join('')}</svg>${heads.join('')}`;
}

// A plain-language summary of the lane, announced to screen readers and shown in the inspector
// when nothing is hovered. The arrows are visual-only, so the same information has to exist as
// text or the game is unplayable without sight of them.
export function laneThreatSummary(state, laneIdx, me) {
  const lane = state.lanes[laneIdx];
  const foe = enemyOf(me);
  let towerDamage = 0;
  let kills = 0;

  for (let slot = 0; slot < SLOTS_PER_SIDE; slot++) {
    const unit = lane.slots[foe][slot];
    if (!unit) continue;
    const target = resolveIntent(state, laneIdx, foe, slot);
    if (!target) continue;
    if (target.kind === 'tower') towerDamage += unit.atk;
    else if (isLethal(unit, target.unit)) kills += 1;
  }

  return { towerDamage, kills };
}
