import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CAMPUS_THUMBS = {
  nu: 'https://upload.wikimedia.org/wikipedia/en/thumb/c/ca/NU_Building.jpg/960px-NU_Building.jpg',
  kbtu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Kazakh-British_Technical_University%2C_Almaty_%28P1180218%29.jpg/960px-Kazakh-British_Technical_University%2C_Almaty_%28P1180218%29.jpg',
  sdu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Suleyman_Demirel_University%2C_Outside_view%2C_Entrance.jpg/960px-Suleyman_Demirel_University%2C_Outside_view%2C_Entrance.jpg',
  iitu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/International_Information_Technology_University_in_Almaty.jpg/960px-International_Information_Technology_University_in_Almaty.jpg',
  kaznu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Al-Farabi_KazNU_rektorat.jpg/960px-Al-Farabi_KazNU_rektorat.jpg',
  kaist: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/KAIST_Main_entrance.jpg/960px-KAIST_Main_entrance.jpg',
  satbayev: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Satbayev_University_2.jpg/960px-Satbayev_University_2.jpg',
  kaznmu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Main_building%2C_Kazak_National_Medical_University.jpg/960px-Main_building%2C_Kazak_National_Medical_University.jpg',
  narxoz: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/%D0%9A%D0%B0%D0%BC%D0%BF%D1%83%D1%81_%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D0%B5%D1%82%D0%B0_%D0%9D%D0%B0%D1%80%D1%85%D0%BE%D0%B7.jpg/960px-%D0%9A%D0%B0%D0%BC%D0%BF%D1%83%D1%81_%D0%A3%D0%BD%D0%B8%D0%B2%D0%B5%D1%80%D1%81%D0%B8%D1%82%D0%B5%D1%82%D0%B0_%D0%9D%D0%B0%D1%80%D1%85%D0%BE%D0%B7.jpg',
  padua: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Palazzo_Bo_%28Padua%29.jpg/960px-Palazzo_Bo_%28Padua%29.jpg',
  tum: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Technische_Universitaet_Muenchen-1.jpg/960px-Technische_Universitaet_Muenchen-1.jpg',
  rwth: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/SuperC_-_bei_Nacht.jpg/960px-SuperC_-_bei_Nacht.jpg',
  metu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Middle_East_Technical_University%2C_Architecture_Studio.jpg/960px-Middle_East_Technical_University%2C_Architecture_Studio.jpg',
  koc: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Ko%C3%A7University2.jpg/960px-Ko%C3%A7University2.jpg',
  asu: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ASU_Old_Main.jpg/960px-ASU_Old_Main.jpg',
  purdue: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Frederick_L_Hovde_Hall_of_Administration_Purdue_University_2016_01.jpg/960px-Frederick_L_Hovde_Hall_of_Administration_Purdue_University_2016_01.jpg',
  polimi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Politecnico_di_Milano_Bovisa_4.jpg/960px-Politecnico_di_Milano_Bovisa_4.jpg',
  yonsei: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Underwood_hall.jpg/960px-Underwood_hall.jpg',
  aitu: 'https://astanait.edu.kz/media/195fe23e__dsc9570.jpg',
  kimep: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Aerial-view-kimep.jpg/960px-Aerial-view-kimep.jpg',
};

const TARGET_DIR = path.resolve('public/assets');

for (const [id, url] of Object.entries(CAMPUS_THUMBS)) {
  const destJpg = path.join(TARGET_DIR, `campus-${id}.jpg`);
  console.log(`Fetching [${id}] -> ${url}`);
  try {
    const cmd = `curl -sL --max-time 15 -A "UniPathApp/1.0 (contact@unipath.kz)" "${url}" -o "${destJpg}"`;
    execSync(cmd, { stdio: 'pipe' });
    const checkCmd = `file "${destJpg}"`;
    const checkOut = execSync(checkCmd, { encoding: 'utf8' });
    if (checkOut.includes('JPEG') || checkOut.includes('PNG') || checkOut.includes('image')) {
      const size = (fs.statSync(destJpg).size / 1024).toFixed(1);
      console.log(`  SUCCESS [${id}]: verified image (${size} KB)`);
    } else {
      console.error(`  INVALID [${id}]: ${checkOut.trim()}`);
    }
  } catch (err) {
    console.error(`  ERROR [${id}]: ${err.message}`);
  }
}

// Update default campus.png from real NU photo
try {
  execSync(`sips -s format png "${path.join(TARGET_DIR, 'campus-nu.jpg')}" --out "${path.join(TARGET_DIR, 'campus.png')}"`, { stdio: 'pipe' });
  console.log('Updated campus.png with real photo of Nazarbayev University.');
} catch (e) {
  console.error('sips convert error:', e.message);
}
