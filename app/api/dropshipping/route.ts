// app/api/dropshipping/route.ts

import { NextRequest } from 'next/server';

// In-memory storage for suppliers connections state (in a real app, this would be in a database)
let connectedSuppliers: Record<string, boolean> = {
  aliexpress: false,
  spocket: false,
  modalyst: false,
};

// Mock data for suppliers
const suppliers = [
  { id: 'aliexpress', name: 'AliExpress', connected: false },
  { id: 'spocket', name: 'Spocket', connected: false },
  { id: 'modalyst', name: 'Modalyst', connected: false },
];

// Mock data for products
const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    supplier: 'AliExpress',
    price: 12.99,
    retailPrice: 39.99,
    stock: 125,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available'
  },
  {
    id: '2',
    name: 'Phone Case with MagSafe',
    supplier: 'Spocket',
    price: 3.45,
    retailPrice: 19.99,
    stock: 0,
    imageUrl: 'https://placehold.co/200x200',
    status: 'out-of-stock'
  },
  {
    id: '3',
    name: 'Stainless Steel Water Bottle',
    supplier: 'Modalyst',
    price: 8.75,
    retailPrice: 24.99,
    stock: 3,
    imageUrl: 'https://placehold.co/200x200',
    status: 'low-stock'
  },
  {
    id: '4',
    name: 'Fitness Tracker Watch',
    supplier: 'AliExpress',
    price: 24.99,
    retailPrice: 59.99,
    stock: 42,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available'
  },
  {
    id: '5',
    name: 'Wireless Charging Pad',
    supplier: 'Spocket',
    price: 15.49,
    retailPrice: 34.99,
    stock: 18,
    imageUrl: 'https://placehold.co/200x200',
    status: 'available'
  }
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  
  // Update supplier connection status based on stored state
  const updatedSuppliers = suppliers.map(supplier => ({
    ...supplier,
    connected: connectedSuppliers[supplier.id] || false
  }));

  if (action === 'suppliers') {
    // Return list of suppliers
    return Response.json(updatedSuppliers);
  } else if (action === 'products') {
    // Return list of products
    return Response.json(products);
  } else {
    // Default: return both suppliers and products
    return Response.json({ suppliers: updatedSuppliers, products });
  }
}

export async function POST(request: NextRequest) {
  const { action, supplierId } = await request.json();

  if (action === 'connect') {
    // Simulate connecting to a supplier
    if (suppliers.some(s => s.id === supplierId)) {
      connectedSuppliers[supplierId] = true;
      const supplier = suppliers.find(s => s.id === supplierId);
      return Response.json({ 
        success: true, 
        message: `${supplier?.name || 'Supplier'} connected successfully!`,
        suppliers: suppliers.map(s => ({
          ...s,
          connected: connectedSuppliers[s.id] || false
        }))
      });
    } else {
      return Response.json({ success: false, message: 'Supplier not found' }, { status: 404 });
    }
  } else if (action === 'sync') {
    // Simulate syncing products from suppliers
    // In a real application, this would call external APIs to fetch real product data
    const connectedSupp = suppliers.filter(s => connectedSuppliers[s.id]);
    
    // Return products from connected suppliers only
    const filteredProducts = products.filter(p => 
      connectedSupp.some(s => s.name === p.supplier)
    );
    
    return Response.json({ 
      success: true, 
      message: 'Products synced successfully!', 
      products: filteredProducts,
      lastSync: new Date().toISOString()
    });
  }

  return Response.json({ success: false, message: 'Invalid action' }, { status: 400 });
}