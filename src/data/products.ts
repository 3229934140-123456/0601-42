import type { Product, OralBroadcast } from '@/types';

const now = new Date();

interface ProductTemplate {
  name: string;
  price: number;
  originalPrice: number;
  stock: number;
  explainDuration: number;
  imageSeed: string;
}

const productTemplates: Record<string, ProductTemplate[]> = {
  美妆: [
    { name: '丝绒哑光唇釉 #正红色', price: 89, originalPrice: 159, stock: 2580, explainDuration: 600, imageSeed: 'beauty1' },
    { name: '水润持妆粉底液 自然色', price: 199, originalPrice: 299, stock: 1200, explainDuration: 900, imageSeed: 'beauty2' },
    { name: '12色眼影盘 大地色系', price: 129, originalPrice: 199, stock: 3200, explainDuration: 720, imageSeed: 'beauty3' },
    { name: '保湿精华液 50ml', price: 168, originalPrice: 258, stock: 890, explainDuration: 480, imageSeed: 'beauty4' },
    { name: '深层清洁面膜 10片装', price: 79, originalPrice: 129, stock: 5600, explainDuration: 360, imageSeed: 'beauty5' },
    { name: '遮瑕膏 自然色', price: 69, originalPrice: 99, stock: 4200, explainDuration: 420, imageSeed: 'beauty6' },
    { name: '定妆散粉 透明色', price: 99, originalPrice: 159, stock: 2800, explainDuration: 300, imageSeed: 'beauty7' },
    { name: '睫毛膏 浓密卷翘', price: 59, originalPrice: 89, stock: 6500, explainDuration: 240, imageSeed: 'beauty8' },
  ],
  数码: [
    { name: '旗舰智能手机 Pro版', price: 4999, originalPrice: 5999, stock: 500, explainDuration: 1200, imageSeed: 'tech1' },
    { name: '无线蓝牙耳机', price: 299, originalPrice: 499, stock: 3000, explainDuration: 600, imageSeed: 'tech2' },
    { name: '智能手表 运动版', price: 899, originalPrice: 1299, stock: 800, explainDuration: 900, imageSeed: 'tech3' },
    { name: '平板电脑 11寸', price: 2499, originalPrice: 2999, stock: 300, explainDuration: 1000, imageSeed: 'tech4' },
    { name: '快充充电器 65W', price: 99, originalPrice: 149, stock: 5000, explainDuration: 300, imageSeed: 'tech5' },
    { name: '机械键盘 青轴', price: 399, originalPrice: 599, stock: 1200, explainDuration: 500, imageSeed: 'tech6' },
  ],
  美食: [
    { name: '手工蛋黄酥 6枚装', price: 39, originalPrice: 59, stock: 5000, explainDuration: 300, imageSeed: 'food1' },
    { name: '坚果大礼包 混合口味', price: 69, originalPrice: 99, stock: 3000, explainDuration: 400, imageSeed: 'food2' },
    { name: '进口巧克力礼盒', price: 128, originalPrice: 188, stock: 1500, explainDuration: 500, imageSeed: 'food3' },
    { name: '即食燕窝 7瓶装', price: 299, originalPrice: 399, stock: 800, explainDuration: 600, imageSeed: 'food4' },
    { name: '有机蜂蜜 500g', price: 89, originalPrice: 129, stock: 2000, explainDuration: 350, imageSeed: 'food5' },
  ],
  健身: [
    { name: '瑜伽垫 加厚防滑', price: 79, originalPrice: 129, stock: 3000, explainDuration: 300, imageSeed: 'fit1' },
    { name: '弹力带 阻力套装', price: 49, originalPrice: 79, stock: 5000, explainDuration: 250, imageSeed: 'fit2' },
    { name: '健身手套 男女同款', price: 59, originalPrice: 89, stock: 2500, explainDuration: 200, imageSeed: 'fit3' },
    { name: '泡沫轴 肌肉放松', price: 69, originalPrice: 99, stock: 2000, explainDuration: 280, imageSeed: 'fit4' },
  ],
  时尚: [
    { name: '夏季碎花连衣裙', price: 199, originalPrice: 299, stock: 800, explainDuration: 600, imageSeed: 'fashion1' },
    { name: '百搭T恤 纯棉', price: 69, originalPrice: 99, stock: 5000, explainDuration: 300, imageSeed: 'fashion2' },
    { name: '牛仔短裤 高腰', price: 129, originalPrice: 189, stock: 1200, explainDuration: 450, imageSeed: 'fashion3' },
    { name: '雪纺衬衫 短袖', price: 159, originalPrice: 229, stock: 900, explainDuration: 400, imageSeed: 'fashion4' },
    { name: '阔腿裤 垂感', price: 179, originalPrice: 259, stock: 600, explainDuration: 500, imageSeed: 'fashion5' },
    { name: '小香风外套', price: 299, originalPrice: 459, stock: 400, explainDuration: 700, imageSeed: 'fashion6' },
    { name: '珍珠项链 轻奢', price: 89, originalPrice: 139, stock: 2000, explainDuration: 250, imageSeed: 'fashion7' },
  ],
  游戏: [
    { name: '电竞游戏耳机', price: 299, originalPrice: 459, stock: 1000, explainDuration: 500, imageSeed: 'game1' },
    { name: '游戏鼠标 无线', price: 199, originalPrice: 299, stock: 1500, explainDuration: 400, imageSeed: 'game2' },
    { name: 'RGB机械键盘', price: 499, originalPrice: 699, stock: 800, explainDuration: 600, imageSeed: 'game3' },
  ],
};

const generateProducts = (
  roomId: string,
  category: string,
  currentExplainIndex: number
): Product[] => {
  const templates = productTemplates[category] || productTemplates['美妆'];
  
  return templates.map((template, index) => {
    const isExplained = index < currentExplainIndex;
    const isExplaining = index === currentExplainIndex;
    const isPending = index > currentExplainIndex;
    
    let salesVolume = 0;
    let clickCount = 0;
    let progress = 0;
    
    if (isExplained) {
      salesVolume = Math.floor(template.stock * (0.2 + Math.random() * 0.5));
      clickCount = Math.floor(salesVolume * (15 + Math.random() * 10));
      progress = 100;
    } else if (isExplaining) {
      salesVolume = Math.floor(template.stock * (0.1 + Math.random() * 0.3));
      clickCount = Math.floor(salesVolume * (20 + Math.random() * 15));
      progress = Math.floor(30 + Math.random() * 50);
    }
    
    const discountTag = template.originalPrice > template.price * 1.5 
      ? `${Math.round((1 - template.price / template.originalPrice) * 100)}% OFF`
      : undefined;
    
    return {
      id: `${roomId}-product-${index + 1}`,
      name: template.name,
      imageUrl: `https://picsum.photos/seed/${template.imageSeed}/200/200`,
      price: template.price,
      originalPrice: template.originalPrice,
      stock: template.stock,
      salesVolume,
      clickCount,
      status: isExplained ? 'explained' : isExplaining ? 'explaining' : 'pending',
      duration: Math.floor(template.explainDuration / 60),
      explainStartTime: isExplaining ? new Date(now.getTime() - 300000).toISOString() : undefined,
      order: index + 1,
      progress,
      discountTag,
    } as Product;
  });
};

const generateOralBroadcasts = (
  roomId: string,
  products: Product[],
  count: number
): OralBroadcast[] => {
  const types: Array<'discount' | 'coupon' | 'reminder'> = ['discount', 'coupon', 'reminder'];
  const templates = [
    '前N名下单立减X元！',
    '下单即送精美礼品！',
    '第二件半价，两件更划算！',
    '记得点关注不迷路哦～',
    '下方小黄车直接拍，都是现货速发！',
    '限时优惠，只剩最后100单！',
    '直播间专属优惠券，点击领取～',
  ];
  
  return Array.from({ length: count }, (_, i) => {
    const product = products[i % products.length];
    const type = types[i % types.length];
    const template = templates[i % templates.length];
    
    return {
      id: `${roomId}-oral-${i + 1}`,
      roomId,
      productId: product.id,
      productName: product.name,
      content: template,
      timestamp: new Date(now.getTime() - (i + 1) * 180000).toISOString(),
      type,
      effect: type !== 'reminder' ? {
        clickIncrease: Math.floor(1000 + Math.random() * 2000),
        orderIncrease: Math.floor(200 + Math.random() * 500),
      } : undefined,
    } as OralBroadcast;
  });
};

export const roomProductsData: Record<string, Product[]> = {
  'room-001': generateProducts('room-001', '美妆', 2),
  'room-002': generateProducts('room-002', '数码', 1),
  'room-003': generateProducts('room-003', '美食', 1),
  'room-004': generateProducts('room-004', '健身', 0),
  'room-005': generateProducts('room-005', '时尚', 2),
  'room-006': generateProducts('room-006', '游戏', 0),
  'room-007': [],
  'room-008': [],
  'room-009': generateProducts('room-009', '家居', 5),
};

export const roomOralData: Record<string, OralBroadcast[]> = {
  'room-001': generateOralBroadcasts('room-001', roomProductsData['room-001'], 5),
  'room-002': generateOralBroadcasts('room-002', roomProductsData['room-002'], 3),
  'room-003': generateOralBroadcasts('room-003', roomProductsData['room-003'], 2),
  'room-005': generateOralBroadcasts('room-005', roomProductsData['room-005'], 4),
  'room-006': generateOralBroadcasts('room-006', roomProductsData['room-006'], 1),
};

export const getRoomProducts = (roomId: string): Product[] => {
  return roomProductsData[roomId] || [];
};

export const getRoomOralBroadcasts = (roomId: string): OralBroadcast[] => {
  return roomOralData[roomId] || [];
};

export const getCurrentExplainingProduct = (roomId: string): Product | undefined => {
  return getRoomProducts(roomId).find((p) => p.status === 'explaining');
};

export const getProductProgress = (roomId: string): number => {
  const products = getRoomProducts(roomId);
  if (products.length === 0) return 0;
  const done = products.filter((p) => p.status === 'explained').length;
  return Math.round((done / products.length) * 100);
};

export const getRoomTotalGmv = (roomId: string): number => {
  return getRoomProducts(roomId).reduce((sum, p) => sum + p.salesVolume * p.price, 0);
};

export const getRoomTotalClicks = (roomId: string): number => {
  return getRoomProducts(roomId).reduce((sum, p) => sum + p.clickCount, 0);
};

export const getRoomConversionRate = (roomId: string): number => {
  const products = getRoomProducts(roomId);
  const totalClicks = products.reduce((sum, p) => sum + p.clickCount, 0);
  const totalOrders = products.reduce((sum, p) => sum + p.salesVolume, 0);
  if (totalClicks === 0) return 0;
  return Number(((totalOrders / totalClicks) * 100).toFixed(2));
};
