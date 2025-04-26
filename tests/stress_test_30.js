import http from 'k6/http';
import { sleep, check } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 30 },
    { duration: '30s', target: 30 },  
    { duration: '10s', target: 0 },  
  ],
};

export default function () {
  // IMPORTANT: If deploying to Elastic Beanstalk, replace the URL below with your Elastic Beanstalk environment URL
  const url = 'http://localhost:8080/attendance/log';
  // const url = 'http://attendance-system-env-1.eba-sem4anku.us-east-1.elasticbeanstalk.com/attendance/log';
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
