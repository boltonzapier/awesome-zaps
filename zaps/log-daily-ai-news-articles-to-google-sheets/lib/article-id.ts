// Short, stable id for an article link. It is the suffix of each row's step name, so each row is journaled on its own.
export function articleId(link: string): string {
  let hash = 5381;
  for (let i = 0; i < link.length; i++) {
    hash = ((hash * 33) ^ link.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36);
}
