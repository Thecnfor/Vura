'use client';

import { useState, useEffect } from 'react';

interface Video {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
  size?: string;
  duration?: string;
}

export default function VideoList() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalSize: '0 MB' });

  useEffect(() => {
    fetch("http://localhost:8000/video")
      .then((res) => {
        if (!res.ok) throw new Error("获取失败");
        return res.json();
      })
      
      // 第1次处理：基础转换
      .then((data) => {
        const processedVideos = data["视频列表"].map((v: string) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: v,
          url: `/stream/${v}`,
          thumbnail: `/thumbnails/${v.replace('.mp4', '.jpg')}`
        }));
        return processedVideos; // 传递给下一步
      })
      
      // 第2次处理：添加模拟数据
      .then((processedVideos) => {
        const enhancedVideos = processedVideos.map((video: any) => ({
          ...video,
          size: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
          duration: `${Math.floor(Math.random() * 300 + 30)}s`
        }));
        return enhancedVideos; // 继续传递
      })
      
      // 第3次处理：计算统计信息
      .then((finalVideos) => {
        setVideos(finalVideos);
        
        // 计算统计数据
        const totalSize = finalVideos.reduce((sum: number, v: { size: any; }) => {
          return sum + parseFloat(v.size || '0');
        }, 0);
        
        setStats({
          total: finalVideos.length,
          totalSize: `${totalSize.toFixed(1)} MB`
        });
      })
      
      .catch((error) => {
        console.error("错误:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="p-8">
      <div className="text-center">加载中...</div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">视频列表</h1>
        <p className="text-gray-600">
          共 {stats.total} 个视频，总大小: {stats.totalSize}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <div key={video.id} className="border rounded-lg p-4">
            <div className="aspect-video bg-gray-200 rounded mb-3 flex items-center justify-center">
              <span className="text-gray-500">视频预览</span>
            </div>
            
            <h3 className="font-semibold truncate">{video.name}</h3>
            <p className="text-sm text-gray-600">大小: {video.size}</p>
            <p className="text-sm text-gray-600">时长: {video.duration}</p>
            
            <div className="mt-3 space-x-2">
              <a 
                href={video.url} 
                className="inline-block bg-blue-500 text-white px-3 py-1 rounded text-sm"
              >
                播放
              </a>
              <a 
                href={video.thumbnail} 
                className="inline-block bg-gray-500 text-white px-3 py-1 rounded text-sm"
              >
                预览
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}