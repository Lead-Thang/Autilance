declare module 'leaflet-providers' {
  import * as L from 'leaflet';

  namespace providers {
    interface ProviderOptions {
      variant?: string;
      style?: string;
      [key: string]: any;
    }

    interface Provider {
      url: string;
      options: ProviderOptions;
    }

    interface ProvidersMap {
      [key: string]: Provider | { [key: string]: Provider };
    }

    const providers: ProvidersMap;
  }

  export = providers;
}