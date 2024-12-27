import { appendFileSync, mkdirSync, openSync } from 'node:fs';

const CSV_HEADERS = [
  'admin_id',
  'created_at',
  'day_of_week',
  'end_date',
  'end_time',
  'id',
  'service_type',
  'start_date',
  'start_time',
  'updated_at',
];

const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
];
const BASE_SERVICES = ['pet-walking', 'pet-sitting', 'pet-bathing'] as const;

const data: string[] = [CSV_HEADERS.join(',')],
  today = new Date(),
  limit = 20;

for (let i = 0; i < limit; i++) {
  // PULLED FROM TEST DB
  const adminId = '6531a983-e358-43e3-bc1a-1fb15c520ad2',
    id = crypto.randomUUID(),
    date = new Date(today),
    startDate = new Date(new Date().setDate(today.getDate() + i)),
    endDate = new Date(
      new Date().setDate(new Date().getDate() + Math.floor(Math.random() * 90))
    ),
    // new Date(new Date().setDate(new Date().getDate() + 17))
    day = startDate.getDay(),
    dayOfWeek = DAYS_OF_WEEK[day],
    serviceType =
      BASE_SERVICES[Math.floor(Math.random() * BASE_SERVICES.length)],
    startTime = '09:00:00',
    endTime = '17:00:00';
  const row = [
    adminId,
    today.toISOString(),
    dayOfWeek,
    endDate.toISOString(),
    endTime,
    id,
    serviceType,
    startDate.toISOString(),
    startTime,
    date.toISOString(),
  ];
  data.push(row.join(','));
}

// console.log(`csv data: ${data.join(',')}`);
const tempDir = `${__dirname}/seed/recurring/`;
mkdirSync(tempDir, { recursive: true });
const tempName = `${tempDir}recurring-availability-${crypto.randomUUID().slice(0, 6)}`;
function writeFile(fileName: string) {
  console.log(`fileName param: ${fileName}`);

  try {
    const fileHandle = openSync(`${fileName}.csv`, 'w+');
    appendFileSync(fileHandle, data.join('\n'));
  } catch (e) {
    console.error(`Error occurred: `, JSON.stringify(e, null, 2));
  }
}

writeFile(tempName);
