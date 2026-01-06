const responseMessages = {
    success: {
        ARTICLE_CREATED: 'Article created successfully.',
        ARTICLE_UPDATED: 'Article updated successfully.',
        ARTICLE_DELETED: 'Article deleted successfully.',
        ARTICLES_FETCHED: 'Articles fetched successfully.'
    },
    fail: {
        ARTICLE_CREATION_FAILED: 'Failed to create article.',
        ARTICLE_UPDATE_FAILED: 'Failed to update article.',
        ARTICLE_DELETION_FAILED: 'Failed to delete article.',
        ARTICLES_FETCH_FAILED: 'Failed to fetch articles.',
        PERMISSION_DENIED: 'Permission denied',
        ARTICLE_NOT_FOUND: 'Article not found',
        ARTICLE_WITH_TITLE_EXISTS: 'Article with this title already exists'

    },
};

export default responseMessages;