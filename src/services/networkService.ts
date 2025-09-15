import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export type NetworkStatus = 'online' | 'offline' | 'unknown';

class NetworkService {
  private listeners: ((status: NetworkStatus) => void)[] = [];
  private currentStatus: NetworkStatus = 'unknown';

  constructor() {
    this.initialize();
  }

  private initialize() {
    // Subscribe to network state updates
    NetInfo.addEventListener((state: NetInfoState) => {
      const newStatus = this.getNetworkStatus(state);
      if (newStatus !== this.currentStatus) {
        this.currentStatus = newStatus;
        this.notifyListeners(newStatus);
      }
    });

    // Get initial state
    NetInfo.fetch().then((state: NetInfoState) => {
      this.currentStatus = this.getNetworkStatus(state);
      this.notifyListeners(this.currentStatus);
    });
  }

  private getNetworkStatus(state: NetInfoState): NetworkStatus {
    if (state.isConnected === null) return 'unknown';
    return state.isConnected && state.isInternetReachable ? 'online' : 'offline';
  }

  private notifyListeners(status: NetworkStatus) {
    this.listeners.forEach(listener => listener(status));
  }

  public subscribe(callback: (status: NetworkStatus) => void): () => void {
    this.listeners.push(callback);
    
    // Immediately call with current status
    if (this.currentStatus !== 'unknown') {
      callback(this.currentStatus);
    }

    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  public getCurrentStatus(): NetworkStatus {
    return this.currentStatus;
  }

  public isOnline(): boolean {
    return this.currentStatus === 'online';
  }

  public isOffline(): boolean {
    return this.currentStatus === 'offline';
  }

  public async checkConnectivity(): Promise<NetworkStatus> {
    try {
      const state = await NetInfo.fetch();
      const status = this.getNetworkStatus(state);
      this.currentStatus = status;
      this.notifyListeners(status);
      return status;
    } catch (error) {
      console.warn('Failed to check connectivity:', error);
      return 'unknown';
    }
  }
}

// Create and export a singleton instance
export const networkService = new NetworkService();
export default networkService;
