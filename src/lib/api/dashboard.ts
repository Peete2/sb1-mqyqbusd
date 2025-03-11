import { supabase } from '../auth';

export const dashboardApi = {
  async getStats() {
    const [
      { count: totalPosts },
      { count: totalAuthors },
      { count: totalCategories },
      { count: totalViews },
    ] = await Promise.all([
      supabase.from('posts').select('*', { count: 'exact', head: true }),
      supabase.from('authors').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('posts').select('view_count').then(({ data }) => ({
        count: data?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0,
      })),
    ]);

    return {
      totalPosts,
      totalAuthors,
      totalCategories,
      totalViews,
    };
  },

  async getRecentActivity() {
    const { data: recentPosts } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        status,
        created_at,
        author:authors(name)
      `)
      .order('created_at', { ascending: false })
      .limit(5);

    return recentPosts;
  },

  async getAnalytics(days = 30) {
    const { data: viewsData } = await supabase
      .from('posts')
      .select('created_at, view_count')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    // Group by date and calculate total views
    const analytics = viewsData?.reduce((acc, post) => {
      const date = new Date(post.created_at).toLocaleDateString();
      acc[date] = (acc[date] || 0) + (post.view_count || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(analytics || {}).map(([date, views]) => ({
      date,
      views,
      engagement: Math.round(views * 0.6), // Example engagement calculation
    }));
  },
};