import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchBanners } from "@/lib/api/supabase";
import { Button } from "@/components/ui/button";

const PromotionalBanners = () => {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners
  });

  if (isLoading) {
    return (
      <section className="py-12 bg-pythronix-gray">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse rounded-lg bg-white p-6">
                <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const prepareBannerLink = (link: string) => {
    if (link.startsWith('http://') || link.startsWith('https://')) {
      return link;
    }
    if (link.startsWith('/')) {
      return link;
    }
    return `/${link}`;
  };

  return (
    <section className="py-12 bg-pythronix-gray">
      <div className="container">
        <div className="grid gap-8 md:grid-cols-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:scale-[1.01]"
            >
              <div className="flex flex-col md:flex-row">
                <div className="flex-1 p-6 md:p-8">
                  <h3 className="mb-2 text-2xl font-bold font-heading text-gray-900">
                    {banner.title}
                  </h3>
                  <p className="mb-6 text-gray-600">
                    {banner.subtitle}
                  </p>
                  {banner.link && (
                    banner.link.startsWith('http://') || banner.link.startsWith('https://') ? (
                      <Button asChild>
                        <a href={banner.link} target="_blank" rel="noopener noreferrer">
                          {banner.button_text || 'Learn More'}
                        </a>
                      </Button>
                    ) : (
                      <Button asChild>
                        <Link to={prepareBannerLink(banner.link)}>
                          {banner.button_text || 'Learn More'}
                        </Link>
                      </Button>
                    )
                  )}
                </div>
                <div className="aspect-[4/3] w-full md:w-2/5">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanners;
