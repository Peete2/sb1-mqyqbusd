import { CategoryData } from '../types';

export const categoryData: Record<string, CategoryData> = {
  news: {
    title: "Latest News",
    description: "Stay informed with the latest breaking news and current events from around the world.",
    featured: {
      id: "news-1",
      title: "Global Summit Addresses Climate Change Crisis",
      preview: "World leaders gather to discuss urgent climate action measures and set ambitious goals for carbon reduction by 2030.",
      thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce",
      date: "Mar 5, 2025",
      category: "news",
      author: {
        name: "Sarah Chen",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
      },
      readTime: "5 min read",
      featured: true,
      tags: ["politics", "climate", "global"]
    },
    posts: [
      {
        id: "news-2",
        title: "Tech Giants Announce Breakthrough in Quantum Computing",
        preview: "Major technology companies reveal significant progress in quantum computing research, promising revolutionary advances.",
        thumbnail: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
        date: "Mar 4, 2025",
        category: "news",
        readTime: "4 min read",
        tags: ["technology", "innovation"]
      },
      {
        id: "news-3",
        title: "Space Tourism Takes Off with First Commercial Flight",
        preview: "Private space company successfully launches its inaugural tourist mission to low Earth orbit.",
        thumbnail: "https://images.unsplash.com/photo-1516849677043-ef67c9557e16",
        date: "Mar 3, 2025",
        category: "news",
        readTime: "6 min read",
        tags: ["space", "technology"]
      }
    ]
  },
  business: {
    title: "Business and Economics",
    description: "Expert analysis and insights on global markets, business trends, and economic developments.",
    featured: {
      id: "business-1",
      title: "AI Revolution in Financial Markets",
      preview: "How artificial intelligence is transforming trading strategies and market analysis in the financial sector.",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3",
      date: "Mar 5, 2025",
      category: "business",
      author: {
        name: "Michael Roberts",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
      },
      readTime: "7 min read",
      featured: true,
      tags: ["finance", "technology", "AI"]
    },
    posts: [
      {
        id: "business-2",
        title: "Sustainable Investing Reaches New Heights",
        preview: "ESG investments continue to grow as investors prioritize environmental and social responsibility.",
        thumbnail: "https://images.unsplash.com/photo-1604762524889-3e2fcc145683",
        date: "Mar 4, 2025",
        category: "business",
        readTime: "5 min read",
        tags: ["investing", "sustainability"]
      }
    ]
  },
  agriculture: {
    title: "Agriculture & Environment",
    description: "Coverage of agricultural innovations, environmental conservation, and sustainable farming practices.",
    featured: {
      id: "agri-1",
      title: "Smart Farming Technologies Transform Agriculture",
      preview: "How IoT and AI are revolutionizing farming practices and increasing crop yields sustainably.",
      thumbnail: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449",
      date: "Mar 5, 2025",
      category: "agriculture",
      author: {
        name: "Emma Thompson",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      },
      readTime: "6 min read",
      featured: true,
      tags: ["technology", "farming", "sustainability"]
    },
    posts: [
      {
        id: "agri-2",
        title: "Vertical Farming Expands in Urban Areas",
        preview: "Cities embrace vertical farming solutions to address food security and reduce carbon footprint.",
        thumbnail: "https://images.unsplash.com/photo-1505471768190-275e2ad070c9",
        date: "Mar 4, 2025",
        category: "agriculture",
        readTime: "4 min read",
        tags: ["urban farming", "sustainability"]
      }
    ]
  },
  climate: {
    title: "Climate",
    description: "In-depth coverage of climate change, environmental policies, and sustainable solutions.",
    featured: {
      id: "climate-1",
      title: "Breakthrough in Carbon Capture Technology",
      preview: "Scientists develop new efficient method for capturing and storing atmospheric carbon dioxide.",
      thumbnail: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce",
      date: "Mar 5, 2025",
      category: "climate",
      author: {
        name: "David Wilson",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
      },
      readTime: "8 min read",
      featured: true,
      tags: ["technology", "environment", "innovation"]
    },
    posts: [
      {
        id: "climate-2",
        title: "Renewable Energy Surpasses Fossil Fuels",
        preview: "Global renewable energy capacity exceeds traditional power sources for the first time.",
        thumbnail: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
        date: "Mar 4, 2025",
        category: "climate",
        readTime: "6 min read",
        tags: ["energy", "sustainability"]
      }
    ]
  },
  health: {
    title: "Health",
    description: "Latest developments in healthcare, medical research, and wellness.",
    featured: {
      id: "health-1",
      title: "Revolutionary Cancer Treatment Shows Promise",
      preview: "New immunotherapy approach demonstrates unprecedented success in early clinical trials.",
      thumbnail: "https://images.unsplash.com/photo-1576671081837-49b1a991dd54",
      date: "Mar 5, 2025",
      category: "health",
      author: {
        name: "Dr. Lisa Chang",
        avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f"
      },
      readTime: "7 min read",
      featured: true,
      tags: ["medical", "research", "cancer"]
    },
    posts: [
      {
        id: "health-2",
        title: "AI-Powered Diagnostics Transform Healthcare",
        preview: "Machine learning algorithms achieve breakthrough accuracy in disease detection.",
        thumbnail: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
        date: "Mar 4, 2025",
        category: "health",
        readTime: "5 min read",
        tags: ["technology", "healthcare", "AI"]
      }
    ]
  }
};