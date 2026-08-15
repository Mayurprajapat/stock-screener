/**
 * WebSocket Simulation Layer
 * Simulates real-time stock price updates with reconnection logic
 * Production code would connect to actual WebSocket server
 */

export interface WebSocketMessage {
  type: 'price_update' | 'connection' | 'reconnecting' | 'error';
  symbol?: string;
  price?: number;
  changePercent?: number;
  timestamp?: number;
  status?: 'connected' | 'disconnected' | 'reconnecting';
  error?: string;
}

export type WebSocketCallback = (message: WebSocketMessage) => void;

class WebSocketSimulator {
  private listeners: Map<string, Set<WebSocketCallback>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnected = false;
  private updateInterval: NodeJS.Timeout | null = null;
  private stocks: string[] = [];

  connect(symbols: string[]): Promise<void> {
    this.stocks = symbols;
    return new Promise((resolve) => {
      this.isConnected = true;
      this.reconnectAttempts = 0;

      // Emit connected message
      this.broadcast({
        type: 'connection',
        status: 'connected',
        timestamp: Date.now(),
      });

      // Start simulating price updates
      this.startPriceUpdates();
      resolve();
    });
  }

  private startPriceUpdates(): void {
    if (this.updateInterval) clearInterval(this.updateInterval);

    // Simulate updates every 500ms to 2000ms
    this.updateInterval = setInterval(() => {
      if (!this.isConnected) return;

      const randomSymbol = this.stocks[Math.floor(Math.random() * this.stocks.length)];
      const priceChange = (Math.random() - 0.5) * 2; // Random change between -1 and +1
      const changePercent = (Math.random() - 0.5) * 0.5; // Random % change

      this.broadcast({
        type: 'price_update',
        symbol: randomSymbol,
        price: priceChange,
        changePercent: changePercent,
        timestamp: Date.now(),
      });
    }, 1000 + Math.random() * 2000);
  }

  disconnect(): void {
    this.isConnected = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    this.broadcast({
      type: 'connection',
      status: 'disconnected',
      timestamp: Date.now(),
    });
  }

  reconnect(): Promise<void> {
    this.reconnectAttempts++;

    if (this.reconnectAttempts > this.maxReconnectAttempts) {
      this.broadcast({
        type: 'error',
        error: 'Max reconnection attempts reached',
        timestamp: Date.now(),
      });
      return Promise.reject(new Error('Max reconnection attempts reached'));
    }

    this.broadcast({
      type: 'reconnecting',
      status: 'reconnecting',
      timestamp: Date.now(),
    });

    return new Promise((resolve) => {
      setTimeout(() => {
        this.connect(this.stocks).then(resolve);
      }, this.reconnectDelay * this.reconnectAttempts);
    });
  }

  on(event: string, callback: WebSocketCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: WebSocketCallback): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)!.delete(callback);
    }
  }

  private broadcast(message: WebSocketMessage): void {
    // Broadcast to all listeners
    this.listeners.forEach((callbacks) => {
      callbacks.forEach((callback) => callback(message));
    });
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}

// Singleton instance
export const wsSimulator = new WebSocketSimulator();
