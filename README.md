# Team River
WooHack '25 - Raelyn Brooks, Akhmad Mamirov, Will Sieber

![image](https://github.com/user-attachments/assets/3c6a3c95-c81c-46f7-9195-3a6a169eac0e)

## Heatin-Cali 
- Our project was inspired by the need to help Californian residents mitigate the impact of wildfires. We aimed to address wildfire challenges across three key areas:
    1. Rescue Efforts
    2. Containment and Risk Management
    3. Post-Recovery Support
- This led to the creation of Heatin-Cali by River, a website that provides real-time wildfire risk assessments for counties across California.

Key Features:
- Interactive Risk Map: A color-coded map displays wildfire likelihood by county:
     1. Green (0-30%) – Safe
     2. Yellow (30-60%) – Caution
     3. Orange (60-80%) – Warning
     4. Red (85-100%) – Danger
- County-Specific Data: Users can click on a county to view a forecasted wildfire risk in real-time.
- When you hover over a county it will tell you the name of said county.

### Random Forest Classifiers Dataset
Technology & Approach:
- We utilized a random forest classifier model, trained on wildfire-related datasets, to predict fire risk and enhance accuracy in forecasting.
- The model can predict at 78% accuracy.
- The dataset used to train the model can be found [here](https://zenodo.org/records/14s712845).
- Also there were an other dataset used in this project:
    1. A large dataset from Wifire Commons to get the coordinates of all the counties boundaries
            [WifireCommons](https://wifire-data.sdsc.edu/nl/dataset/counties-in-california/resource/1dba9680-5ed6-4061-b070-165d394b0508?inner_span=True).
- To predict using the model, we use the ```weather.gov``` API to get the current forecast for a particular area. This is then fed into the pre-trained model.

### Deployment 
- You can find the application [here](https://river-dpr6.onrender.com/).

![image](https://github.com/user-attachments/assets/f0d9a652-0bda-4fc4-b6d9-1a18a1b75d85)

## Resources
- LeafletJS: OpenStreetMap
- Scikit-Learn
- Random Forest Classifier
- Wifire Commons
- Google CoLab


### Setting Up

To manage dependencies, Python uses virtual environments to prevent packages from being installed globally.

#### Windows (PowerShell)

1. Within nextjs-flask folder: If necessary, install virtualenv with ```pip install virtualenv```
2. Create a virtual environment with ```py -3 -m venv .venv```
3. Activate using ```.venv\bin\activate\```
4. Install Flask with ```pip install flask```
5. Install Python dependencies located in ```requirements.txt```

#### Mac OSX / Linux / WSL

1. Within nextjs-flask folder: If necessary, install virtualenv with ```sudo apt-get install virtualenv```
2. Create a virtual environment with ```python3 -m venv .venv```
3. Activate using ```source .venv/bin/activate```
4. Install Flask with ```pip install flask```
5. Install Python dependencies located in ```requirements.txt```

#### Python Dependencies
- Once the virtual environment is active, install ```requests``` with ```pip install requests```

### Testing

```npm run dev``` starts the server on ```localhost:3000```.
