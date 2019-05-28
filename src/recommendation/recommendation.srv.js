import { PythonShell } from 'python-shell';

class RecommendationService {
  getRecommendation(bandsIds) {
    return new Promise(async (resolve) => {
      const options = {
        mode: 'text',
        scriptPath: './scripts',
        args: [JSON.stringify(bandsIds)]
      };

      if (process.env.PYTHON_PATH) {
        options.pythonPath = process.env.PYTHON_PATH;
      }

      await PythonShell.run('recommend.py', options, (err, results) => {
        if (err) throw err;
        resolve(JSON.parse(results[0]));
      });
    });
  }
}

export default new RecommendationService();
