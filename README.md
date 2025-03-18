# Seattle & NYC Traffic Project
Geog 328 Traffic project

**Website Link:** https://cameronsmutz.github.io/traffic-project/intro.html

**Project:** Tracking Seattle versus NYC Traffic Flow

**Team Members:** Andrew Hoch, Cameron Smutz, Edward Park, Leo Shim, Peter Pham (BA8) 

**Traffic Project Favicon:**
  ![Traffic Project Favicon](assets/Traffic_Project_Favicon.png)

**Goal:** This project aims to create an interactive web-based GIS application that both visualizes and compares traffic flow patterns in the major United States metropolitan cities of Seattle, Washington and New York City, New York. This project also intends to show how traffic flows have changed over time within the specific city of study. This application will allow the audience to analyze traffic congestion, urban mobility, and their patterns over time. We would also like to see the spatial relationship between them collisions and traffic flows.

**Target Audience:**  One group that our map project could be targeted towards is city planners and transportation agencies. Agencies like the Seattle Department of Transportation could use this project for infrastructure improvements, as well as policy planning. Additionally, individuals and residents who commute to work could use this project to optimize their daily transportation routes. Another target group would be delivery companies like FedEx, Amazon, and USPS who are looking to plan efficiency routes and reduce delays in deliveries. Our map could also be used by researchers and academics who are studying transportation systems, both public or private, and their impact on urban planning, the environment and overall urban systems. 

**Functions:** Our map utilizes the Mapbox heatmap layer function to display the magnitute of traffic flows on certain roadways and the concentration of car crashes in specific spots. The color of the points on the heatmap indicates the magnitude of the statistic, with a whiter area representing higher traffic flows or more observed collisions. The added feature to toggle an overlay of the vizualizations of crashes over the traffic counts heatmap also gives the opportunity to observe spatial relationships between the two statistics. A time slider has been added, allowing the user to choose a year between 2020-2023, and observe the change in traffic and collisions over time. This will be interesting as it will allow the audience to see if any specific areas have improved or worsened dramatically. We have also incorporated another layer of interactivity that changes the the traffic counts heatmap layer into a circle layer as you zoom in, allowing the user to more clearly match the color of the traffic count observation spot to the colors on the legend. These points on the map are also able to be clicked on to show the name of the road and the annual average traffic counts on the road. You can also click on the points where collisions occurred and it will show you the road name and number of collisions, injuries, and deaths associated.
<br>
<br>
![image](https://github.com/user-attachments/assets/8c6b9ed5-86e2-4bf4-9b37-d09695c2afbc)
![image](https://github.com/user-attachments/assets/ec60884f-0add-40c0-beeb-b766b3bccc3e)
![image](https://github.com/user-attachments/assets/9211de99-609e-4e8d-9f1d-439154a730e7)


---

**Utilized Libraries:** <br>
Mapbox-gl.js  
Github and Github Pages for filesharing and hosting  
Custom Mapbox basemap created by Edward Park

---

## Datasets:

NY Traffic Flow Dataset: [https://www.nyc.gov/site/nypd/stats/traffic-data/traffic-data-collision.page](https://nysdottrafficdata.drakewell.com/publicmultinodemap.asp)

Seattle Traffic Flow Dataset: https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-collisions-all-years/about

NYC Crash Mapper Websiite: https://crashmapper.org/#/

SDOT collision data: https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-collisions-all-years/about

---

The two datasets above contain traffic flow data for the two metropolitan cities. The dataset for New York City contains data from 2016 - 2023. On the other hand, the data for the city of Seattle contains data from the years 2020 - 2025. These datasets will be used to make our heatmaps showcasing collision rates in the two cities. Additionally, the multitude of different years will allow us to showcase how traffic collisions have either increased or decreased or decreased over the years. Lastly, both datasets include specific coordinates of the collisions. In our project we will be able to highlight specific areas of the two cities that are prone to a high number of collisions. 

To clean our above datasets we first started by filtering the data down to our specific years of inquiry. For the Seattle dataset we specifically optimized the point data by filtering down the coordinates from 17 digits to 5 digits. We also removed unnecessary features such as the “title” and “id” fields. For the Seattle dataset we also created a new geojson file for each of the different individual years which helped increase processing speed on the webpage and allowing us to look at one year at a time.

It is also important to note that in order to properly display the data correctly for Seattle traffic counts, we had to filter out duplicate traffic count points that appeared on the same coordinate during the same year, because the original data source recorded average traffic measurements on the same spot multiple times a year. This means that without filtering the dataset, the heatmap would overlap multiple points over the same spot, intensifying the color intensity, and making it look like there is larger annual average traffic flow.

---

**AI Use Disclosure:**
Github Copilot was used to assist debugging
