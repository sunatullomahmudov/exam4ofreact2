export type Order = {
  key: string;
  id: string;
  date: string;
  customer: string;
  payment: "Paid" | "Pending";
  status: "Ready" | "Shipped" | "Received";
  total: string;
};

export const demoOrders: Order[] = [
  ["1", "#12512B", "May 5, 4:20 PM", "Tom Anderson", "Paid", "Ready", "49.90"],
  ["2", "#12523C", "May 5, 4:15 PM", "Jayden Walker", "Paid", "Ready", "34.36"],
  ["3", "#51232A", "May 5, 4:15 PM", "Inez Kim", "Paid", "Ready", "5.51"],
  ["4", "#23534D", "May 5, 4:12 PM", "Francisco Henry", "Paid", "Shipped", "29.74"],
  ["5", "#51323C", "May 5, 4:12 PM", "Violet Phillips", "Paid", "Shipped", "23.06"],
  ["6", "#35622A", "May 5, 4:12 PM", "Rosetta Becker", "Paid", "Shipped", "87.44"],
  ["7", "#34232D", "May 5, 4:10 PM", "Dean Love", "Paid", "Ready", "44.55"],
  ["8", "#56212D", "May 5, 4:08 PM", "Nettie Tyler", "Paid", "Ready", "36.79"],
  ["9", "#23534D", "May 5, 4:04 PM", "Miguel Harris", "Pending", "Ready", "50.54"],
  ["10", "#12523C", "May 5, 4:04 PM", "Angel Conner", "Pending", "Ready", "63.47"],
  ["11", "#51232A", "May 5, 4:03 PM", "Rosalie Singleton", "Pending", "Received", "91.63"],
].map(([key, id, date, customer, payment, status, total]) => ({
  key,
  id,
  date,
  customer,
  payment: payment as Order["payment"],
  status: status as Order["status"],
  total,
}));

export const emptyOrder: Order = {
  key: "",
  id: "",
  date: "",
  customer: "",
  payment: "Paid",
  status: "Ready",
  total: "",
};

export const orderStorageKey = "fastcart-demo-orders";
