import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '1m',
};

export default function () {
  // IMPORTANT: Replace with your Elastic Beanstalk URL if different
  // http.post('http://attendance-system-env-1.eba-sem4anku.us-east-1.elasticbeanstalk.com/attendance/log', JSON.stringify({
  http.post('http://localhost:8080/attendance/log', JSON.stringify({
    token: `test-nfc-${__VU}`,
    method: 'NFC',
    deviceInfo: 'Web'
  }), {
    headers: { 'Content-Type': 'application/json' }
  });

  sleep(1);
}
