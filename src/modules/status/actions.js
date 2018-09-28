export async function getAvailableQuota() {
  const { quota, usage } = await navigator.storage.estimate();
  return quota - usage;
}
