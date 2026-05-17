# Blog Post Format

Each post has two parts:

1. Add metadata to `manifest.json`.
2. Create one HTML fragment in this folder.

Example manifest entry:

```json
{
  "slug": "my-new-post",
  "title": "My New Post",
  "dateLabel": "Sunday, May 17 2026",
  "music": "Artist - Song",
  "youtubeId": "VIDEO_ID",
  "file": "./posts/my-new-post.html"
}
```

Post files should only contain body markup:

```html
<div class="blog-body">
  <p>Write the post here.</p>
</div>
```

Use `slug` as the post anchor. For example: `/blogs/blogs.html#my-new-post`.

The archive page only displays one post at a time. Keep the newest post first in `manifest.json`; it is the default visible post. Older posts appear in the catalogue below it and open when their date is clicked.
