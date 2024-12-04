export default function isEditor() {
  return location.href.search('editor') > -1;
}