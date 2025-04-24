import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 1,
  duration: '1m',
};

export default function () {
  http.post('http://attendance-system-env-1.eba-sem4anku.us-east-1.elasticbeanstalk.com/attendance/log', JSON.stringify({
    token: `test-nfc-${__VU}`,
    method: 'NFC',
    deviceInfo: 'Web'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  sleep(1);
}