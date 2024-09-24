import Carousel from "react-bootstrap/Carousel";
import ExampleCarouselImage from "./ExampleCarouselImage";
import "bootstrap/dist/css/bootstrap.min.css";

function UncontrolledExample() {
  return (
    <div>
      <h2 className="text-center my-5">Testimonials</h2>
    
    <Carousel>
      <Carousel.Item>
        <ExampleCarouselImage />
        <Carousel.Caption className="absolute inset-0 flex flex-col justify-center items-center bg-opacity-50 text-white p-4 text-center">
          <h3 className="text-2xl font-semibold">
            Our neighborhood was facing a major water pipe burst, and within
            hours of reporting it, the team was at our location. They fixed the
            issue quickly, and we were back to normal in no time. Highly
            recommended!
          </h3>
          <p className="mt-4 text-lg">
            — Rajesh K., Resident of Greenfield Community
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <ExampleCarouselImage />
        <Carousel.Caption className="absolute inset-0 flex flex-col justify-center items-center bg-opacity-50 text-white p-4 text-center">
          <h3 className="text-2xl font-semibold">
            Our school had a water pipe issue that disrupted our daily
            activities. The team resolved it swiftly without causing any
            interruptions to our schedule. We’re thankful for their professional
            and prompt service.
          </h3>
          <p className="mt-4 text-lg">
            — Mr. Sharma, Principal at Bright Future School
          </p>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <ExampleCarouselImage />
        <Carousel.Caption className="absolute inset-0 flex flex-col justify-center items-center bg-opacity-50 text-white p-4 text-center">
          <h3 className="text-2xl font-semibold">
            Our entire street faced a water outage due to a broken main pipe.
            The team arrived promptly and worked tirelessly to fix the issue.
            The water was back on within hours, and they even followed up to
            ensure everything was working perfectly!
          </h3>
          <p className="mt-4 text-lg">
            — Deepak R., Local Resident
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
    </div>
  );
}

export default UncontrolledExample;
