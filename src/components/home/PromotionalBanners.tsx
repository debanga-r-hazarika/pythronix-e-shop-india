
import { Link } from "react-router-dom";
import { banners } from "@/lib/data";
import { Button } from "@/components/ui/button";

const PromotionalBanners = () => {
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
                  <Button asChild>
                    <Link to={banner.link}>
                      {banner.buttonText}
                    </Link>
                  </Button>
                </div>
                <div className="aspect-[4/3] w-full md:w-2/5">
                  <img
                    src={banner.image}
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
