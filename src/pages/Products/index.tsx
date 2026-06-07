import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  TrendingUp,
  Plus,
  Tag,
  DollarSign,
  Package,
  MousePointerClick,
  Percent,
  Play,
  CheckCircle,
  Circle,
  Mic,
  ListChecks,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import StatCard from '@/components/common/StatCard';
import {
  formatNumber,
  formatPrice,
  formatDuration,
  formatTime,
  getOralTypeText,
  getOralTypeColor,
  getProductStatusText,
} from '@/utils/format';
import { cn } from '@/lib/utils';
import type { OralType } from '@/types';

const ProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const products = useAppStore((state) => state.products);
  const oralBroadcasts = useAppStore((state) => state.oralBroadcasts);
  const addOralBroadcast = useAppStore((state) => state.addOralBroadcast);

  const roomId = id || currentRoomId;

  const [activeTab, setActiveTab] = useState<'products' | 'oral'>('products');
  const [showAddOral, setShowAddOral] = useState(false);
  const [newOral, setNewOral] = useState({
    content: '',
    type: 'discount' as OralType,
    productId: '',
    productName: '',
  });

  const sortedProducts = useMemo(
    () => [...products].sort((a, b) => a.order - b.order),
    [products]
  );

  const currentProduct = useMemo(
    () => products.find((p) => p.status === 'explaining'),
    [products]
  );

  const progress = useMemo(() => {
    const done = products.filter((p) => p.status === 'done').length;
    const total = products.length;
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }, [products]);

  const totalGmv = useMemo(() => {
    return products.reduce((sum, p) => sum + p.soldCount * p.price, 0);
  }, [products]);

  const totalClicks = useMemo(() => {
    return products.reduce((sum, p) => sum + p.clickCount, 0);
  }, [products]);

  const handleAddOral = () => {
    if (!newOral.content.trim()) return;
    addOralBroadcast({
      roomId,
      content: newOral.content,
      type: newOral.type,
      productId: newOral.productId || undefined,
      productName: newOral.productName || undefined,
    });
    setNewOral({ content: '', type: 'discount', productId: '', productName: '' });
    setShowAddOral(false);
  };

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">商品管理</h2>
          <p className="text-sm text-text-secondary mt-1">
            监控商品讲解进度，记录优惠口播
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-bg-secondary rounded-lg p-0.5 border border-border">
            <button
              onClick={() => setActiveTab('products')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                activeTab === 'products'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <ShoppingBag size={16} />
              商品列表
            </button>
            <button
              onClick={() => setActiveTab('oral')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2',
                activeTab === 'oral'
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-secondary hover:text-text-primary'
              )}
            >
              <Mic size={16} />
              口播记录
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="商品总数"
          value={products.length}
          icon={Package}
          color="cyan"
          subtitle={`已讲解 ${progress}%`}
        />
        <StatCard
          title="商品点击"
          value={formatNumber(totalClicks)}
          icon={MousePointerClick}
          trend={{ value: 18.5, isUp: true }}
          color="orange"
        />
        <StatCard
          title="预计GMV"
          value={formatPrice(totalGmv)}
          icon={DollarSign}
          trend={{ value: 12.3, isUp: true }}
          color="green"
        />
        <StatCard
          title="转化率"
          value="3.98%"
          icon={Percent}
          color="purple"
          subtitle="高于行业均值"
        />
      </div>

      {activeTab === 'products' ? (
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-bg-secondary rounded-xl border border-border p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <ListChecks size={18} className="text-accent" />
                讲解进度
              </h3>
              <span className="text-sm text-accent font-medium">
                {progress}%
              </span>
            </div>

            <div className="h-2 bg-bg-primary rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {sortedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className={cn(
                    'p-3 rounded-lg border transition-all',
                    product.status === 'explaining'
                      ? 'bg-accent/5 border-accent/50 ring-1 ring-accent/30'
                      : product.status === 'done'
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-bg-primary border-border hover:border-border-hover'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        product.status === 'explaining'
                          ? 'bg-accent text-white'
                          : product.status === 'done'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500/30 text-text-tertiary'
                      )}
                    >
                      {product.status === 'done' ? (
                        <CheckCircle size={14} />
                      ) : product.status === 'explaining' ? (
                        <Play size={12} />
                      ) : (
                        index + 1
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          'text-sm font-medium truncate',
                          product.status === 'done'
                            ? 'text-text-tertiary line-through'
                            : 'text-text-primary'
                        )}
                      >
                        {product.name}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-accent">
                          {formatPrice(product.price)}
                        </span>
                        <span className="text-xs text-text-tertiary">
                          {formatDuration(product.explainDuration)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-1 rounded',
                        product.status === 'explaining'
                          ? 'bg-accent/10 text-accent'
                          : product.status === 'done'
                          ? 'bg-green-500/10 text-green-500'
                          : 'bg-gray-500/10 text-text-tertiary'
                      )}
                    >
                      {getProductStatusText(product.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-bg-secondary rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-text-primary">
                  商品详情
                </h3>
                {currentProduct && (
                  <span className="text-sm text-accent flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    当前讲解中
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {currentProduct ? (
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="relative shrink-0">
                      <img
                        src={currentProduct.image}
                        alt={currentProduct.name}
                        className="w-32 h-32 rounded-xl object-cover"
                      />
                      <span className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-red-500 text-white text-xs font-medium">
                        热卖
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-text-primary">
                        {currentProduct.name}
                      </h4>
                      <div className="mt-3 flex items-baseline gap-3">
                        <span className="text-2xl font-bold text-red-500">
                          {formatPrice(currentProduct.price)}
                        </span>
                        <span className="text-sm text-text-tertiary line-through">
                          {formatPrice(currentProduct.originalPrice)}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-500 text-xs">
                          省 ¥{currentProduct.originalPrice - currentProduct.price}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-text-secondary">库存：</span>
                          <span className="text-text-primary font-medium">
                            {formatNumber(currentProduct.stock)} 件
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-text-secondary">已售：</span>
                          <span className="text-text-primary font-medium">
                            {formatNumber(currentProduct.soldCount)} 件
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-bg-primary border border-border">
                      <div className="text-sm text-text-secondary mb-1">
                        商品点击
                      </div>
                      <div className="text-xl font-bold text-orange-500">
                        {formatNumber(currentProduct.clickCount)}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        +12.5% 较上小时
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-bg-primary border border-border">
                      <div className="text-sm text-text-secondary mb-1">
                        转化率
                      </div>
                      <div className="text-xl font-bold text-green-500">
                        {((currentProduct.soldCount / currentProduct.clickCount) * 100).toFixed(2)}%
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        高于均值 2.1%
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-bg-primary border border-border">
                      <div className="text-sm text-text-secondary mb-1">
                        预计GMV
                      </div>
                      <div className="text-xl font-bold text-purple-500">
                        {formatPrice(currentProduct.soldCount * currentProduct.price)}
                      </div>
                      <div className="text-xs text-text-tertiary mt-1">
                        累计销售额
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={16} className="text-accent" />
                      <span className="text-sm font-medium text-text-primary">
                        讲解进度
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-cyan-400 rounded-full animate-pulse"
                            style={{ width: '60%' }}
                          />
                        </div>
                      </div>
                      <span className="text-sm text-text-secondary">
                        已讲解 {formatDuration(420)} /{' '}
                        {formatDuration(currentProduct.explainDuration)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                  <ShoppingBag size={48} className="mb-4 opacity-50" />
                  <p>暂无正在讲解的商品</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 min-h-0 bg-bg-secondary rounded-xl border border-border overflow-hidden flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <Mic size={18} className="text-orange-500" />
              口播记录
            </h3>
            <button
              onClick={() => setShowAddOral(true)}
              className="h-8 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              记录口播
            </button>
          </div>

          {showAddOral && (
            <div className="p-4 border-b border-border bg-bg-primary/50">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">
                    口播类型
                  </label>
                  <select
                    value={newOral.type}
                    onChange={(e) =>
                      setNewOral({ ...newOral, type: e.target.value as OralType })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary focus:outline-none focus:border-accent/50"
                  >
                    <option value="discount">折扣优惠</option>
                    <option value="coupon">优惠券</option>
                    <option value="reminder">温馨提示</option>
                    <option value="other">其他</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">
                    关联商品
                  </label>
                  <select
                    value={newOral.productId}
                    onChange={(e) => {
                      const product = products.find((p) => p.id === e.target.value);
                      setNewOral({
                        ...newOral,
                        productId: e.target.value,
                        productName: product?.name || '',
                      });
                    }}
                    className="w-full h-9 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary focus:outline-none focus:border-accent/50"
                  >
                    <option value="">不关联商品</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm text-text-secondary mb-1 block">
                  口播内容
                </label>
                <input
                  type="text"
                  value={newOral.content}
                  onChange={(e) =>
                    setNewOral({ ...newOral, content: e.target.value })
                  }
                  placeholder="输入口播内容..."
                  className="w-full h-9 px-3 rounded-lg bg-bg-primary border border-border text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent/50"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowAddOral(false)}
                  className="h-8 px-4 rounded-lg border border-border text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleAddOral}
                  className="h-8 px-4 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
                >
                  确认记录
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {oralBroadcasts.map((oral) => (
              <div
                key={oral.id}
                className="p-4 rounded-lg bg-bg-primary border border-border hover:border-border-hover transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center',
                        oral.type === 'discount'
                          ? 'bg-red-500/10'
                          : oral.type === 'coupon'
                          ? 'bg-orange-500/10'
                          : oral.type === 'reminder'
                          ? 'bg-blue-500/10'
                          : 'bg-gray-500/10'
                      )}
                    >
                      {oral.type === 'discount' || oral.type === 'coupon' ? (
                        <Tag
                          size={20}
                          className={getOralTypeColor(oral.type)}
                        />
                      ) : (
                        <Mic
                          size={20}
                          className={getOralTypeColor(oral.type)}
                        />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded',
                            getOralTypeColor(oral.type),
                            oral.type === 'discount'
                              ? 'bg-red-500/10'
                              : oral.type === 'coupon'
                              ? 'bg-orange-500/10'
                              : oral.type === 'reminder'
                              ? 'bg-blue-500/10'
                              : 'bg-gray-500/10'
                          )}
                        >
                          {getOralTypeText(oral.type)}
                        </span>
                        {oral.productName && (
                          <span className="text-xs text-text-secondary">
                            关联商品：{oral.productName}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-text-primary mt-1">
                        {oral.content}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-text-tertiary">
                    {formatTime(oral.timestamp)}
                  </span>
                </div>
                {oral.effect && (
                  <div className="mt-3 pt-3 border-t border-border flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={14} className="text-orange-500" />
                      <span className="text-xs text-text-secondary">
                        点击提升：
                        <span className="text-text-primary font-medium">
                          +{formatNumber(oral.effect.clickIncrease)}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp size={14} className="text-green-500" />
                      <span className="text-xs text-text-secondary">
                        订单增加：
                        <span className="text-text-primary font-medium">
                          +{formatNumber(oral.effect.orderIncrease)}
                        </span>
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
