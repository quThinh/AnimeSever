const corsAnywhere = require("cors-anywhere");

const { LIMIT } = require("./constants");
const Model = require("./model");
const { pageToPagination } = require("./utils");

let proxy = corsAnywhere.createServer({
  originWhitelist: [],
  requireHeaders: [],
  removeHeaders: [],
  setHeaders: {
    referer: "https://vuighe.net/",
  },
});

class Controller {
  //get recently anime
  static async getRecentlyUpdated(_req, res, next) {
    try {
      const recentlyUpdatedList = await Model.recentlyUpdated();

      res.json({ success: true, data: recentlyUpdatedList });
    } catch (err) {
      next(err);
    }
  }
  //get anime's information
  static async getInfo(req, res, next) {
    const { slug } = req.params;

    try {
      const info = await Model.getInfo(slug);

      res.json({ success: true, data: info });
    } catch (err) {
      next(err);
    }
  }
  //get random episode
  static async getEpisode(req, res, next) {
    const { animeId, episodeIndex } = req.params;

    try {
      const episode = await Model.getEpisode(animeId, episodeIndex);

      res.json({ success: true, data: episode });
    } catch (err) {
      next(err);
    }
  }
  //get all episodes
  static async getEpisodes(req, res, next) {
    const { animeId } = req.params;

    try {
      const episodes = await Model.getEpisodes(animeId);

      res.json({ success: true, data: episodes });
    } catch (err) {
      next(err);
    }
  }
  //get comment of
  static async getComments(req, res, next) {
    const { animeId, limit } = req.params;
    const { page } = req.query;

    const { offset } = pageToPagination(page);

    try {
      const comments = await Model.getComments(animeId, offset, limit);

      res.json({ success: true, data: comments });
    } catch (err) {
      next(err);
    }
  }
  //get anime through genre
  static async getGenre(req, res, next) {
    const { slug } = req.params;
    const { page = 1, limit } = req.query;

    try {
      const { data, total } = await Model.getGenre(slug, page);

      res.json({
        success: true,
        data,
        pagination: totalToPagination(total, page, limit),
      });
    } catch (err) {
      next(err);
    }
  }
  //search anime
  static async search(req, res, next) {
    const { q, limit, page = 1 } = req.query;

    try {
      const { data, total } = await Model.search(q, limit);

      res.json({
        success: true,
        data,
        pagination: totalToPagination(total, page, limit),
      });
    } catch (err) {
      next(err);
    }
  }
  //get thumbnail, slug, views, name of an anime
  static async getSlide(_req, res, next) {
    try {
      const slideList = await Model.slide();

      res.json({ success: true, data: slideList });
    } catch (err) {
      next(err);
    }
  }
  //get recommend anime
  static async getRecommended(_req, res, next) {
    try {
      const recommendedList = await Model.recommended();

      res.json({ success: true, data: recommendedList });
    } catch (err) {
      next(err);
    }
  }
  //get ranking anime
  static async getRanking(req, res, next) {
    const { slug } = req.params;

    try {
      const rankingList = await Model.getRanking(slug);

      res.json({ success: true, data: rankingList });
    } catch (err) {
      next(err);
    }
  }
//fix cors for all url
  static async corsAnywhere(req, res) {
    req.url = req.url.replace("/cors/", "/");
    proxy.emit("request", req, res);
  }
}

const totalToPagination = (total, page, limit = LIMIT) => {
  return {
    currentPage: Number(page),
    totalPage: Math.round(total / limit),
  };
};
module.exports = Controller;
