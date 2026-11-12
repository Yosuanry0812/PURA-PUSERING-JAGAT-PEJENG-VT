/** Keep mutually exclusive gallery fields consistent when changing media type. */
export function galleryPayload(data: Record<string, unknown>) {
  const photo = data.media_type === "photo";
  return {
    ...data,
    media_url: photo ? data.media_url : "",
    video_url: photo ? "" : data.video_url,
    thumbnail_url: photo ? "" : data.thumbnail_url,
    storage_path: photo ? data.media_url : null,
    temple_object_id: data.temple_object_id || null,
  };
}
