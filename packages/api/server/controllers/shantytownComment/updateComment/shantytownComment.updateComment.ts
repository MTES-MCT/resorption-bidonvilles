import shantytownCommentService from '#server/services/shantytownComment';
import makeUpdateCommentController from '#server/controllers/_common/makeUpdateCommentController';

export default makeUpdateCommentController(shantytownCommentService.updateComment);
