import { notify } from './helpers';

export function share(title, text, url) {
  if (navigator.share !== undefined) {
    navigator.share({
      title,
      text,
      url
    });
  } else {
    Clipboard.writeText(`${text}: ${url}`)
      .then(() => notify('Текст скопирован в буфер обмена'))
      .catch(() => alert(`${text}: ${url}`));
  }
}