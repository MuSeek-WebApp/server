import { BandModel } from './band.model';

class BandSrv {
  async all() {
    return BandModel.find({})
      .lean()
      .exec();
  }

  async findByName(name) {
    return BandModel.find({
      name: { $regex: `${name}`, $options: 'i' }
    })
      .lean()
      .exec();
  }

  async findByIds(bandIds) {
    return BandModel.find({ _id: { $in: bandIds } })
      .lean()
      .exec();
  }

  async findByAttributes(genres) {
    const genresRegex = [];
    for (const genre of genres) {
      genresRegex.push(new RegExp(`^${genre}$`, 'i'));
    }
    return BandModel.find({ genres: { $in: genresRegex } })
      .lean()
      .exec();
  }
}

export default new BandSrv();
