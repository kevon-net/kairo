export const registerServiceWorker = async (params: {
  pathToWorker: string;
  onRegistrationSuccess?: (registration: ServiceWorkerRegistration) => void;
}) => {
  if (typeof window == 'undefined') return;
  if (!('serviceWorker' in navigator)) return;

  // window.addEventListener('load', () => {
  try {
    await navigator.serviceWorker.register(params.pathToWorker, {
      scope: '/',
    });

    const readyRegistration = await navigator.serviceWorker.ready;
    // console.log('Service Worker ready:', readyRegistration);

    if (params.onRegistrationSuccess) {
      params.onRegistrationSuccess(readyRegistration);
    }
  } catch (error) {
    console.error('Service Worker registration failed:', error);
  }
  // });
};
