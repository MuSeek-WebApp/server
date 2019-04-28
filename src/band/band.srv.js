import { BandModel } from './band.model';

class BandSrv {
  async all() {
    return BandModel.find({});
  }

  async findByName(name) {
    return BandModel.find({ name: { $regex: `${name}`, $options: 'i' } });
  }

  async findByAttributes(genres) {
    const genresRegex = [];
    for (const genre of genres) {
      genresRegex.push(new RegExp(`^${genre}$`, 'i'));
    }
    return BandModel.find({ genres: { $in: genresRegex } });
  }
}

export default new BandSrv();
