import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ScrollView } from '@progress/kendo-react-scrollview';
const items = [{
  position: 1,
  url: 'https://demos.telerik.com/blazor-ui/images/photos/1.jpg'
}, {
  position: 2,
  url: 'https://demos.telerik.com/blazor-ui/images/photos/2.jpg'
}, {
  position: 3,
  url: 'https://demos.telerik.com/blazor-ui/images/photos/3.jpg'
}, {
  position: 4,
  url: 'https://demos.telerik.com/blazor-ui/images/photos/4.jpg'
}, {
  position: 5,
  url: 'https://demos.telerik.com/blazor-ui/images/photos/5.jpg'
}];
const CarouselLanding = () => {
  return <div>
      <ScrollView style={{
      width: "100%",
      height: 384
    }}>
        {items.map((item, index) => {
        return <div className="image-with-text" key={index}>
              <p>Showing image {item.position} of {items.length}.</p>
              <img src={item.url} alt={`KendoReact ScrollView Photo ${item.position}`} style={{
            width: "100%",
            height: 384
          }} draggable={false} />
            </div>;
      })}
      </ScrollView>
    </div>;
};

export default CarouselLanding
