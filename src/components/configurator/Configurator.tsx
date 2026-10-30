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
              <img
                className={styles.previewImage}
                src={`/previews/color-${c.label.toLowerCase()}.svg`}
                alt=""
                aria-hidden="true"
              />
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
            <img className={styles.previewImage} src="/previews/finish-shiny.svg" alt="" aria-hidden="true" />
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
            <img className={styles.previewImage} src="/previews/finish-matte.svg" alt="" aria-hidden="true" />
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
            <img className={styles.previewImage} src="/previews/tray-single.svg" alt="" aria-hidden="true" />
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
            <img className={styles.previewImage} src="/previews/tray-double.svg" alt="" aria-hidden="true" />
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
            <img className={styles.previewImage} src="/previews/interface-analog.svg" alt="" aria-hidden="true" />
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
            <img className={styles.previewImage} src="/previews/interface-digital.svg" alt="" aria-hidden="true" />
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