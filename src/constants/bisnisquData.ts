export const BISNISQU_DART_CODE = `import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget {
  const DashboardPage({Super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'BisnisQu',
          style: TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Status Lisensi Ringkas
            _buildLicenseBanner(),
            const SizedBox(height: 20),

            // Header Section 1
            const Text(
              'Pilih Modul Usaha',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Grid Menu Modul (2x2)
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.2,
              children: [
                _buildModuleCard(
                  title: 'Bengkel',
                  icon: Icons.build_circle_outlined,
                  color: Colors.orange,
                  onTap: () {},
                ),
                _buildModuleCard(
                  title: 'Resto / Kedai',
                  icon: Icons.restaurant,
                  color: Colors.redAccent,
                  onTap: () {},
                ),
                _buildModuleCard(
                  title: 'Collab / Titip',
                  icon: Icons.storefront_outlined,
                  color: Colors.purple,
                  onTap: () {},
                ),
                _buildModuleCard(
                  title: 'Ritel / Toko',
                  icon: Icons.shopping_bag_outlined,
                  color: Colors.blue,
                  onTap: () {},
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Header Section 2 (Management Universal)
            const Text(
              'Management & Control',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            // Sub-Menu Management (List View Card Minimalis)
            _buildManagementItem(
              title: 'Staff / Karyawan',
              subtitle: 'Hak akses & kinerja staff',
              icon: Icons.people_outline,
              onTap: () {},
            ),
            _buildManagementItem(
              title: 'Marketing & Promo',
              subtitle: 'Voucher, diskon & pelanggan',
              icon: Icons.campaign_outlined,
              onTap: () {},
            ),
            _buildManagementItem(
              title: 'Laporan Penjualan',
              subtitle: 'Omzet harian, mingguan & bulanan',
              icon: Icons.bar_chart_rounded,
              onTap: () {},
            ),
            _buildManagementItem(
              title: 'Pengaturan (Setting)',
              subtitle: 'Printer, Cabang & Paket Pro (Rp1.000/hr)',
              icon: Icons.settings_outlined,
              onTap: () {},
            ),
          ],
        ),
      ),
    );
  }

  // Banner Status Lisensi
  Widget _buildLicenseBanner() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.blue.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.blue.shade200),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: const [
              Icon(Icons.workspace_premium, color: Colors.blue),
              SizedBox(width: 8),
              Text(
                'Status: Free (Basic)',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ],
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.blue,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            onPressed: () {},
            child: const Text('Upgrade Pro'),
          )
        ],
      ),
    );
  }

  // Card Grid Modul
  Widget _buildModuleCard({
    required String title,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(icon, size: 40, color: color),
            const SizedBox(height: 8),
            Text(
              title,
              textAlign: TextAlign.center,
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 14,
                color: Colors.black80,
              ),
            ),
          ],
        ),
      ),
    );
  }

  // List View Card Minimalis (Management)
  Widget _buildManagementItem({
    required String title,
    required String subtitle,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      elevation: 0,
      shape: RoundedRectangleBorder(
        side: BorderSide(color: Colors.grey.shade200),
        borderRadius: BorderRadius.circular(12),
      ),
      child: ListTile(
        leading: Icon(icon, color: Colors.blueGrey),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
        ),
        subtitle: Text(
          subtitle,
          style: const TextStyle(fontSize: 12, color: Colors.grey),
        ),
        trailing: const Icon(Icons.chevron_right, size: 20),
        onTap: onTap,
      ),
    );
  }
}
`;

export const BISNISQU_POS_DART_CODE = `import 'package:flutter/material.dart';

class POSPage extends StatefulWidget {
  final String moduleTitle; // Contoh: "Ritel" atau "Resto"
  const POSPage({Super.key, required this.moduleTitle});

  @override
  State<POSPage> createState() => _POSPageState();
}

class _POSPageState extends State<POSPage> {
  // Dummy Data Produk
  final List<Map<String, dynamic>> _products = [
    {'id': '1', 'name': 'Oli Mesin Matic 0.8L', 'price': 45000, 'stock': 12, 'category': 'Ritel'},
    {'id': '2', 'name': 'Busi Motor Standard', 'price': 15000, 'stock': 25, 'category': 'Ritel'},
    {'id': '3', 'name': 'Nasi Goreng Spesial', 'price': 20000, 'stock': 50, 'category': 'Resto'},
    {'id': '4', 'name': 'Es Teh Manis', 'price': 5000, 'stock': 100, 'category': 'Resto'},
  ];

  // Map untuk menyimpan item keranjang {productId: qty}
  final Map<String, int> _cart = {};

  void _addToCart(String id) {
    setState(() {
      _cart[id] = (_cart[id] ?? 0) + 1;
    });
  }

  void _removeFromCart(String id) {
    if (!_cart.containsKey(id)) return;
    setState(() {
      if (_cart[id]! > 1) {
        _cart[id] = _cart[id]! - 1;
      } else {
        _cart.remove(id);
      }
    });
  }

  int get _totalItemCount => _cart.values.fold(0, (sum, qty) => sum + qty);

  int get _totalPrice {
    int total = 0;
    _cart.forEach((id, qty) {
      final product = _products.firstWhere((p) => p['id'] == id);
      total += (product['price'] as int) * qty;
    });
    return total;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Kasir - \${widget.moduleTitle}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.search),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter Kategori / Search Bar Ringkas
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: Colors.grey.shade100,
            child: Row(
              children: [
                const Icon(Icons.tune, size: 20, color: Colors.grey),
                const SizedBox(width: 8),
                Text(
                  'Modul Aktif: \${widget.moduleTitle}',
                  style: const TextStyle(fontWeight: FontWeight.w600, color: Colors.grey),
                ),
              ],
            ),
          ),

          // List View Card Minimalis untuk Daftar Produk
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(12),
              itemCount: _products.length,
              itemBuilder: (context, index) {
                final product = _products[index];
                final String id = product['id'];
                final int qty = _cart[id] ?? 0;

                return Card(
                  margin: const EdgeInsets.only(bottom: 8),
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    side: BorderSide(color: Colors.grey.shade200),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                    child: Row(
                      children: [
                        // Icon Barang / Makanan
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: Colors.blue.shade50,
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Icon(
                            widget.moduleTitle == 'Resto' ? Icons.fastfood_outlined : Icons.inventory_2_outlined,
                            color: Colors.blue,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 12),

                        // Detail Nama & Harga
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                product['name'],
                                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                'Rp \${product[\'price\']}  •  Stok: \${product[\'stock\']}',
                                style: TextStyle(fontSize: 12, color: Colors.grey.shade600),
                              ),
                            ],
                          ),
                        ),

                        // Tombol Aksi Tambah / Kurang Qty Minimalis
                        qty == 0
                            ? OutlinedButton(
                                style: OutlinedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
                                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                ),
                                onPressed: () => _addToCart(id),
                                child: const Text('Tambah'),
                              )
                            : Row(
                                children: [
                                  IconButton(
                                    icon: const Icon(Icons.remove_circle_outline, color: Colors.redAccent),
                                    onPressed: () => _removeFromCart(id),
                                  ),
                                  Text(
                                    '\$qty',
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                                  ),
                                  IconButton(
                                    icon: const Icon(Icons.add_circle_outline, color: Colors.blue),
                                    onPressed: () => _addToCart(id),
                                  ),
                                ],
                              ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // Bottom Bar Keranjang & Pembayaran
          if (_totalItemCount > 0)
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.05),
                    blurRadius: 10,
                    offset: const Offset(0, -3),
                  ),
                ],
              ),
              child: SafeArea(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '\$_totalItemCount Item',
                          style: const TextStyle(fontSize: 12, color: Colors.grey),
                        ),
                        Text(
                          'Rp \$_totalPrice',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blue),
                        ),
                      ],
                    ),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      ),
                      onPressed: () {
                        // Modal / Navigasi Pembayaran
                      },
                      child: const Text('Bayar Sekarang', style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}
`;

export const PUBSPEC_YAML = `name: bisnisqu
description: Aplikasi Manajemen POS & Bisnis Multi-Usaha (Bengkel, Resto, Titip/Collab, Ritel).
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  cupertino_icons: ^1.0.6
  intl: ^0.19.0
  provider: ^6.1.2
  shared_preferences: ^2.2.3
  blue_thermal_printer: ^1.2.3
  fl_chart: ^0.69.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0

flutter:
  uses-material-design: true
`;
