import { COLORS } from "../../config/colors";
import { useConfig } from "../../store";

import styles from './configurator.module.css'


export default function Configurator () {

  const color = useConfig((s) => s.color);
  const setColor = useConfig((s) => s.setColor);

  const shiny = useConfig((s) => s.shiny);
  const setShiny = useConfig((s) => s.setShiny);

  const tray = useConfig((s) => s.tray);
  const setTray = useConfig((s) => s.setTray);

  const digital = useConfig((s) => s.digital);
  const setDigital = useConfig((s) => s.setDigital);

  return (
    <aside className={styles.configurator}>
      <h1>Airfryer Configurator</h1>

      <div >
        <h2>Color</h2>
        { COLORS.map(c =>
          <label key={c.value}>
            <span className={styles.option}>
              {c.label}
            </span>
            <input
              type="radio"
              name="color"
              value={c.value}
              checked={color === c.value}
              onChange={() => setColor(c.value)}
            />
          </label>
        )}
      </div>
      
      <div>
        <h2>Finish</h2>
        <label>
          <span className={styles.option}>
            Shiny
          </span>
          <input 
            type="radio"
            name="shiny"
            checked={shiny}
            onChange={() => setShiny(true)}
          />
        </label>
        <label>
          <span className={styles.option}>
            Matte
          </span>
          <input 
            type="radio"
            name="shiny"
            checked={!shiny}
            onChange={() => setShiny(false)}
          />
        </label>
      </div>

      <div>
        <h2>Trays</h2>
        <label>
          <span className={styles.option}>
            Single
          </span>
          <input 
            type="radio"
            name="tray"
            checked={!tray}
            onChange={() => setTray(false)}
          />
        </label>
        <label>
          <span className={styles.option}>
            Double
          </span>
          <input 
            type="radio"
            name="tray"
            checked={tray}
            onChange={() => setTray(true)}
          />
        </label>
      </div>


      <div>
        <h2>Interface</h2>
        <label>
          <span className={styles.option}>
            Analog
          </span>
          <input 
            type="radio"
            name="digital"
            checked={!digital}
            onChange={() => setDigital(false)}
          />
        </label>
        <label>
          <span className={styles.option}>
            Digital
          </span>
          <input 
            type="radio"
            name="digital"
            checked={digital}
            onChange={() => setDigital(true)}
          />
        </label>
      </div>

    </aside>
  )
}
