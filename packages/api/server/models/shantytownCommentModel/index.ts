import create from '#server/models/shantytownCommentModel/create';
import findAll from '#server/models/shantytownCommentModel/findAll';
import findByShantytown from '#server/models/shantytownCommentModel/findByShantytown';
import findOne from '#server/models/shantytownCommentModel/findOne';
import getHistory from '#server/models/shantytownCommentModel/getHistory';
import deleteComment from '#server/models/shantytownCommentModel/deleteComment';
import serializeComment from '#server/models/shantytownCommentModel/serializeComment';
import update from '#server/models/shantytownCommentModel/update';

export default {
    create,
    findAll,
    findByShantytown,
    findOne,
    getHistory,
    deleteComment,
    serializeComment,
    update,
};
