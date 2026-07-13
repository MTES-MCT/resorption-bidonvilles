import actionCommentService from '#server/services/actionComment';
import makeDeleteCommentController from '#server/controllers/_common/makeDeleteCommentController';

export default makeDeleteCommentController(actionCommentService.deleteComment);
