# My Little Configurator - AirFryer

## Project

An interactive 3D configurator for the fryday™ air fryer. Choose its color, finish, tray, controls, and viewing window, and see the changes on the model as you make them.

[Live Demo](https://fryday-airfryer.vercel.app/)

## Technologies

- React
- TypeScript
- React Three Fiber
- Drei
- Vite

## Getting Started

Install the dependencies and start the development server:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To create a production build, run `npm run build`.

## Options

### Color

- Terracotta
- Silver Mist
- Sage
- Rose Quartz

### Finish

- Shiny: +€5
- Matte: included

### Tray

- Single: included
- Double: +€15

### Interface

- Analog: included
- Digital: +€45

### Viewing window

- No glass: included
- Glass: +€40

The base price is €120. The total updates as options are selected. The default configuration is Terracotta, Shiny, Single, Analog, and No glass, for a total of €125.

## How It Works

Select **Start customizing** to move through the five options. Use the previous and next buttons or the step indicators to navigate. The 3D model updates with the selected options, and the camera changes view between steps.

On the final step, **Add to Cart** opens an order summary with the selected options and total. **Pay** closes the summary and resets the configurator; it does not process a payment.

## Credits

This project uses the following 3D models and material sources:

### 3D models

- Old frying pan — [Sketchfab](https://sketchfab.com/3d-models/old-frying-pan-a976c9fadff94869919f4210b887586f)
- Olive oil — [Sketchfab](https://sketchfab.com/3d-models/olive-oil-db96970b2e1643bdbfa4090ed87b7365)
- French fries — [Sketchfab](https://sketchfab.com/3d-models/french-fries-c45d116dc25e4ab8bf2d16a4fa22a3a9)
- Salt and pepper shakers — [Sketchfab](https://sketchfab.com/3d-models/salt-and-pepper-shakers-de57284dcdc941d1b728f91fd60654a4)
- Knife holder — [Sketchfab](https://sketchfab.com/3d-models/knife-holder-33168c1e12784aaea08ed4e727665884)
- Plate — [Sketchfab](https://sketchfab.com/3d-models/plate-519c319332ed4708ba4b3ca1dfd5f54a)

### Materials and textures

- Teak veneer texture — [Poly Haven](https://polyhaven.com/a/teak_veneer)
- Tile texture — [AmbientCG](https://ambientcg.com/view?id=Tiles107)

## Author

Created by Maurice Halsberghe, Programming student at Artevelde University of Applied Sciences in Ghent. Below you can find my profiles and portfolio.

- [GitHub](https://github.com/mauriceHalsberghe)
- [LinkedIn](https://www.linkedin.com/in/maurice-halsberghe)
- [My Portfolio](https://mauriceh.vercel.app/)