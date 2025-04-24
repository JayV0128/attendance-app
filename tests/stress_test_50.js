import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 50 },   // ramp up to 50 users over 10 seconds
    { duration: '30s', target: 50 },   // stay at 50 users for 30 seconds
    { duration: '10s', target: 0 },    // ramp down to 0
  ],
};

export default function () {
  const url = 'http://attendance-system-env-1.eba-sem4anku.us-east-1.elasticbeanstalk.com/attendance/log';
  const payload = JSON.stringify({
    token: `test-nfc-${__VU}`,
    method: 'NFC',
    deviceInfo: "Web"              
  });

  const params = {
    headers: { 'Content-Type': 'application/json' },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 201': (r) => r.status === 201,
  });

  sleep(1);
}