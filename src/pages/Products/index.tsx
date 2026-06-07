import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  ShoppingBag,
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Play,
  Pause,
  CheckCircle,
  Circle,
  Mic,
  Tag,
  Plus,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { channels } from '@/data/channels';
import { formatPrice, formatTime, formatNumber } from '@/utils/format';
import { generateLiveReport, downloadReport } from '@/utils/export';
import { cn } from '@/lib/utils';
import type { Product, OralBroadcast } from '@/types';

const ProductsPage = () => {
  const { id } = useParams<{ id: string }>();
  const currentRoomId = useAppStore((state) => state.currentRoomId);
  const getRoomProducts = useAppStore((state) => state.getRoomProducts);
  const getRoomOralBroadcasts = useAppStore(
    (state) => state.getRoomOralBroadcasts
  );
  const updateProductStatus = useAppStore(
    (state) => state.updateProductStatus
  );
  const operatorConclusions = useAppStore(
    (state) => state.operatorConclusions
  );

  const roomId = id || currentRoomId;
  const room = channels.find((c) => c.id === roomId);
  const products = getRoomProducts(roomId);
  const oralBroadcasts = getRoomOralBroadcasts(roomId);

  const [currentProductId, setCurrentProductId] = useState<string | null>(
    products.find((p) => p.status === 'explaining')?.id || null
  );
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'explaining' | 'explained'
  >('all');

  const hasData = products.length > 0;

  const stats = useMemo(() => {
    const total = products.length;
    const explained = products.filter((p) => p.status === 'explained').length;
    const explaining = products.filter(
      (p) => p.status === 'explaining'
    ).length;
    const pending = products.filter((p) => p.status === 'pending').length;
    const totalGmv = products.reduce(
      (sum, p) => sum + p.salesVolume * p.price,
      0
    );

    return {
      total,
      explained,
      explaining,
      pending,
      progress: total > 0 ? Math.round((explained / total) * 100) : 0,
      totalGmv,
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (filterStatus === 'all') return products;
    return products.filter((p) => p.status === filterStatus);
  }, [products, filterStatus]);

  const currentProduct = useMemo(() => {
    return products.find((p) => p.id === currentProductId) || null;
  }, [products, currentProductId]);

  const getStatusIcon = (status: Product['status']) => {
    switch (status) {
      case 'pending':
        return <Circle size={14} className="text-text-tertiary" />;
      case 'explaining':
        return <Play size={14} className="text-green-500 animate-pulse" />;
      case 'explained':
        return <CheckCircle size={14} className="text-green-500" />;
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'pending':
        return '待讲解';
      case 'explaining':
        return '讲解中';
      case 'explained':
        return '已讲解';
    }
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-500/10 text-text-tertiary';
      case 'explaining':
        return 'bg-green-500/10 text-green-500';
      case 'explained':
        return 'bg-green-500/10 text-green-500';
    }
  };

  const handleExport = () => {
    if (!room) return;

    const comments = useAppStore.getState().getRoomComments(roomId);
    const pinnedComments = comments.filter((c) => c.isPinned);
    const risks = useAppStore.getState().getRoomRisks(roomId);
    const frequentComments = useAppStore
      .getState()
      .getRoomFrequentComments(roomId);

    const report = generateLiveReport({
      room,
      pinnedComments,
      frequentComments: frequentComments.map((fc) => ({
        keyword: fc.keyword,
        count: fc.count,
      })),
      products,
      oralBroadcasts,
      risks,
      operatorConclusion: operatorConclusions[roomId],
    });

    downloadReport(room.title, report);
  };

  if (!hasData) {
    return (
      <div className="h-full flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">商品管理</h2>
            <p className="text-sm text-text-secondary mt-1">
              {room ? `${room.title} - ` : ''}管理商品讲解进度、口播记录和转化数据
            </p>
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            导出复盘
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center bg-bg-secondary rounded-xl border border-border">
          <ShoppingBag size={64} className="text-text-tertiary mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            暂无商品数据
          </h3>
          <p className="text-sm text-text-secondary mb-6">
            该直播间暂无商品数据，请先添加商品
          </p>
          <div className="flex gap-3">
            <button className="h-10 px-5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2">
              <Plus size={16} />
              添加商品
            </button>
            <button className="h-10 px-5 rounded-lg border border-border text-text-secondary text-sm font-medium hover:text-text-primary hover:border-border-hover transition-colors">
              从商品库导入
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-text-primary">商品管理</h2>
          <p className="text-sm text-text-secondary mt-1">
            {room ? `${room.title} - ` : ''}管理商品讲解进度、口播记录和转化数据
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-bg-secondary rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-text-secondary">
              商品讲解进度:{' '}
              <span className="text-text-primary font-medium">
                {stats.progress}%
              </span>
            </span>
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-4 rounded-lg bg-accent/10 text-accent text-sm font-medium hover:bg-accent/20 transition-colors flex items-center gap-2"
          >
            <FileText size={16} />
            导出复盘
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Package size={20} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">商品总数</p>
              <p className="text-xl font-bold text-text-primary">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">已讲解</p>
              <p className="text-xl font-bold text-green-500">
                {stats.explained}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <TrendingUp size={20} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">预计GMV</p>
              <p className="text-xl font-bold text-text-primary">
                {formatPrice(stats.totalGmv)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-bg-secondary rounded-xl border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <DollarSign size={20} className="text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-text-secondary">讲解完成度</p>
              <p className="text-xl font-bold text-accent">
                {stats.progress}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <ShoppingBag size={18} className="text-accent" />
              商品讲解列表
            </h3>
            <div className="flex items-center gap-2">
              {[
                { value: 'all', label: '全部' },
                { value: 'pending', label: '待讲解' },
                { value: 'explaining', label: '讲解中' },
                { value: 'explained', label: '已讲解' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() =>
                    setFilterStatus(
                      filter.value as
                        | 'all'
                        | 'pending'
                        | 'explaining'
                        | 'explained'
                    )
                  }
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                    filterStatus === filter.value
                      ? 'bg-accent/10 text-accent'
                      : 'text-text-secondary hover:text-text-primary'
                  )}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                onClick={() => setCurrentProductId(product.id)}
                className={cn(
                  'p-4 rounded-xl border cursor-pointer transition-all',
                  currentProductId === product.id
                    ? 'border-accent bg-accent/5'
                    : 'border-border bg-bg-primary hover:border-accent/50'
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <h4 className="font-medium text-text-primary line-clamp-2">
                        {product.name}
                      </h4>
                      <span
                        className={cn(
                          'shrink-0 px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1',
                          getStatusColor(product.status)
                        )}
                      >
                        {getStatusIcon(product.status)}
                        {getStatusText(product.status)}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-lg font-bold text-accent">
                        ¥{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-text-tertiary line-through">
                          ¥{product.originalPrice}
                        </span>
                      )}
                      {product.discountTag && (
                        <span className="px-1.5 py-0.5 rounded text-xs bg-red-500/10 text-red-500">
                          {product.discountTag}
                        </span>
                      )}
                    </div>

                    <div className="mt-2 flex items-center gap-4 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <TrendingUp size={12} />
                        点击 {formatNumber(product.clickCount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign size={12} />
                        销量 {product.salesVolume}
                      </span>
                      {product.duration && (
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          讲解 {product.duration} 分钟
                        </span>
                      )}
                    </div>

                    {product.status === 'explaining' && (
                      <div className="mt-3 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 rounded-full transition-all duration-500"
                          style={{ width: `${product.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-4">
          {currentProduct && (
            <div className="bg-bg-secondary rounded-xl border border-border p-4">
              <h3 className="text-base font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Play size={18} className="text-green-500" />
                当前讲解商品
              </h3>
              <div className="flex items-center gap-3">
                <img
                  src={currentProduct.imageUrl}
                  alt={currentProduct.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-text-primary text-sm line-clamp-2">
                    {currentProduct.name}
                  </h4>
                  <p className="text-lg font-bold text-accent mt-1">
                    ¥{currentProduct.price}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (currentProduct.status === 'explaining') {
                      updateProductStatus(
                        roomId,
                        currentProduct.id,
                        'explained'
                      );
                    }
                  }}
                  className="flex-1 h-9 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium hover:bg-green-500/20 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  完成讲解
                </button>
                <button className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-hover transition-colors">
                  <Pause size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col bg-bg-secondary rounded-xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="text-base font-semibold text-text-primary flex items-center gap-2">
                <Mic size={18} className="text-purple-500" />
                口播记录
              </h3>
              <span className="text-xs text-text-secondary">
                共 {oralBroadcasts.length} 条
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {oralBroadcasts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-text-tertiary">
                  <AlertCircle size={40} className="mb-3 opacity-50" />
                  <p className="text-sm">暂无口播记录</p>
                </div>
              ) : (
                oralBroadcasts.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-lg bg-bg-primary border border-border"
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Mic size={16} className="text-purple-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-text-primary leading-relaxed">
                          {record.content}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-xs text-text-tertiary">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {formatTime(record.timestamp)}
                          </span>
                          {record.productName && (
                            <span className="flex items-center gap-1">
                              <Tag size={12} />
                              {record.productName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
