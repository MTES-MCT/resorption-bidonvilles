import actionCommentService from '#server/services/actionComment';
import makeUpdateCommentController from '#server/controllers/_common/makeUpdateCommentController';

export default makeUpdateCommentController(actionCommentService.updateComment);
