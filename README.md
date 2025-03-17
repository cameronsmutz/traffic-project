# traffic-project
Geog 328 Traffic project

**Website Link:** https://cameronsmutz.github.io/traffic-project/index.html

**Project:** Tracking Seattle versus NY Traffic Flow

**Team Members:** Andrew Hoch, Cameron Smutz, Edward Park, Leo Shim, Peter Pham (BA8) 

 

**Proposal:** This project aims to create an interactive web-based GIS application that both visualizes and compares traffic flow patterns in the major United States metropolitan cities of Seattle, Washington and New York City, New York. This project also intends to show how traffic flows have changed over time within the specific city of study. This application will allow the audience to analyze traffic congestion, urban mobility, and their patterns over time. We may also be able to add an optional layer that shows a heatmap of reported traffic collisions in order to see the relationship between them and the traffic flows.

**Target Audience:**  One group that our map project could be targeted towards is city planners and transportation agencies. Agencies like the Seattle Department of Transportation could use this project for infrastructure improvements, as well as policy planning. Additionally, individuals and residents who commute to work could use this project to optimize their daily transportation routes. Another target group would be delivery companies like FedEx, Amazon, and USPS who are looking to plan efficiency routes and reduce delays in deliveries. Our map could also be used by researchers and academics who are studying transportation systems, both public or private, and their impact on urban planning, the environment and overall urban systems. 

**Functions:** To begin, our map could implement cluster analysis to determine areas with higher or lower traffic congestion. Our project will also use heatmaps to display the different density of traffic in areas. This could be used in partnership with the cluster analysis and would show commuters which areas to avoid when travelling. We can add an additional optional layer that you can toggle on and off that will overlay a heatmap of reported traffic collisions. Moreover, our final project will use a time slider in order to show how traffic and collisions have changed in these two major cities over time. This will be interesting as it will allow the audience to see if any specific areas have improved or worsened dramatically. Furthermore, we could implement shortest path analysis to determine the fastest routes from location A to location B based on traffic conditions. 

NY Traffic Flow Dataset: https://www.nyc.gov/site/nypd/stats/traffic-data/traffic-data-collision.pageLinks to an external site.

Seattle Traffic Flow Dataset: https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-collisions-all-years/aboutLinks to an external site.

NYC Crash Mapper Websiite: https://crashmapper.org/#/

SDOT collision data: https://data-seattlecitygis.opendata.arcgis.com/datasets/SeattleCityGIS::sdot-collisions-all-years/about

The two datasets above contain traffic flow data for the two metropolitan cities. The dataset for New York City contains data from 2016 - 2023. On the other hand, the data for the city of Seattle contains data from the years 2020 - 2025. These datasets will be used to make our heatmaps showcasing collision rates in the two cities. Additionally, the multitude of different years will allow us to showcase how traffic collisions have either increased or decreased or decreased over the years. Lastly, both datasets include specific coordinates of the collisions. In our project we will be able to highlight specific areas of the two cities that are prone to a high number of collisions. 

To clean our above datasets we first started by filtering the data down to our specific years of inquiry. For the Seattle dataset we specifically optimized the point data by filtering down the coordinates from 17 digits to 5 digits. We also removed unnecessary features such as the “title” and “date” fields. For the Seattle dataset we also created a new geojson file for each of the different individual years allowing us to look at one year at a time. 
