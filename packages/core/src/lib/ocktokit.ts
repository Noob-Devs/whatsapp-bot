import { Octokit } from '@octokit/rest'

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

/**
 * Creates a new discussion in a GitHub repository.
 *
 * This function uses the GitHub GraphQL API to create a discussion within a specified
 * repository and category. It requires the user to provide a title, body, category ID,
 * and repository ID for the discussion.
 *
 * @param {Object} params - The parameters for creating the discussion.
 * @param {string} params.title - The title of the discussion.
 * @param {string} params.body - The body content of the discussion.
 * @param {string} params.categoryId - The ID of the category where the discussion will be created.
 * @param {string} params.repositoryId - The ID of the repository where the discussion will be created.
 *
 * @returns {Promise<any>} A promise that resolves to the response from the GitHub API.
 */
export const createDiscussionInGithub = async ({
  title,
  body,
  categoryId,
  repositoryId,
}: {
  title: string
  body: string
  categoryId: string
  repositoryId: string
}): Promise<any> => {
  const query = `
    mutation {
      createDiscussion(input: {
        repositoryId: "${repositoryId}", 
        title: "${title}",
        body: "${body}",
        categoryId: "${categoryId}"
      }) {
        discussion {
          id
          title
          body
          number
        }
      }
    }
  `
  const {
    createDiscussion: { discussion },
  } = await octokit.graphql<any>(query)
  return { discussion }
}
