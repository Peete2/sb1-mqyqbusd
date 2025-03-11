import React from 'react';
import { useParams } from 'react-router-dom';
import AdBanner from '../components/AdBanner';
import { BlogPost } from '../types';

// This would typically come from an API
const SAMPLE_ARTICLE: BlogPost = {
  id: '1',
  title: 'The Future of AI in Content Creation',
  preview: 'Exploring how artificial intelligence is revolutionizing the way we create and consume digital content in the modern era.',
  thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  date: 'Mar 1, 2025',
  category: 'technology',
  content: `
    <p>Artificial intelligence is rapidly transforming the landscape of content creation, offering new possibilities and challenges for creators and consumers alike. As we move further into 2025, the integration of AI tools in content production has become increasingly sophisticated and widespread.</p>

    <h2>The Rise of AI-Assisted Creation</h2>
    <p>Content creators are now leveraging AI to streamline their workflows and enhance their creative processes. From automated video editing to intelligent writing assistance, AI tools are becoming indispensable in the modern content creation ecosystem.</p>

    <p>However, the human element remains crucial. While AI can enhance and accelerate content production, the unique perspective and creativity that human creators bring to their work cannot be replicated by machines alone.</p>

    <h2>Impact on Content Consumption</h2>
    <p>On the consumption side, AI is revolutionizing how content is delivered to audiences. Personalized recommendations, dynamic content adaptation, and real-time translation are just a few examples of how AI is making content more accessible and engaging for users worldwide.</p>
  `,
  author: {
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330'
  }
};

export default function ArticlePage() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <article className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={SAMPLE_ARTICLE.thumbnail}
                alt={SAMPLE_ARTICLE.title}
                className="w-full h-[400px] object-cover"
              />
              
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={SAMPLE_ARTICLE.author?.avatar}
                    alt={SAMPLE_ARTICLE.author?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{SAMPLE_ARTICLE.author?.name}</p>
                    <p className="text-sm text-gray-500">{SAMPLE_ARTICLE.date}</p>
                  </div>
                </div>

                <h1 className="text-4xl font-bold text-gray-900 mb-4 font-['Roboto']">
                  {SAMPLE_ARTICLE.title}
                </h1>

                <div className="prose prose-lg max-w-none font-['Open_Sans']"
                  dangerouslySetInnerHTML={{ __html: SAMPLE_ARTICLE.content || '' }}
                />

                {/* Inline Advertisement */}
                <AdBanner type="inline" />

                {/* Continue with article content */}
                <div className="prose prose-lg max-w-none font-['Open_Sans']">
                  <h2>Looking Ahead</h2>
                  <p>As AI technology continues to evolve, we can expect to see even more innovative applications in content creation and distribution. The key will be finding the right balance between automated efficiency and human creativity.</p>
                  
                  <h2>Conclusion</h2>
                  <p>The future of content creation is a collaborative one, where AI and human creators work together to produce higher quality content more efficiently than ever before. As we continue to explore and refine these technologies, the possibilities for creative expression and content innovation are boundless.</p>
                </div>
              </div>
            </article>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <AdBanner type="sidebar" />
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Related Articles</h3>
              <div className="space-y-4">
                {/* Add related articles here */}
                <div className="group cursor-pointer">
                  <h4 className="font-medium group-hover:text-[#FFDD00] transition duration-300">
                    The Impact of Machine Learning on Digital Marketing
                  </h4>
                  <p className="text-sm text-gray-500">Feb 28, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}