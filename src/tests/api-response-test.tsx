/**
 * API Response Handling Test & Documentation
 * 
 * This file demonstrates how the API response flow works
 */

import { authorsService } from '@/services';

/**
 * Server Response Structure:
 * {
 *   "code": 200,
 *   "message": "Success",
 *   "data": [...]
 * }
 * 
 * Flow:
 * 1. Server responds with: { code: 200, message: "Success", data: [...] }
 * 2. Axios receives full HTTP response
 * 3. Response interceptor unwraps: returns response.data (the ApiResponse<T>)
 * 4. Service receives: ApiResponse<T> = { code: 200, message: "Success", data: [...] }
 * 5. Service extracts data: response.data (the actual data array/object)
 * 6. Component gets: The actual data (e.g., Author[])
 */

export const testApiResponseHandling = async () => {
    try {
        console.log('=== Testing API Response Handling ===\n');

        // Test 1: Get all authors
        console.log('1. Calling authorsService.getAll()...');
        const authors = await authorsService.getAll();

        console.log('✅ Received authors:', authors);
        console.log('   Type:', Array.isArray(authors) ? 'Array' : typeof authors);
        console.log('   Count:', authors.length);

        if (authors.length > 0) {
            console.log('   First author:', authors[0]);
            console.log('   Fields:', Object.keys(authors[0]));
        }

        // Test 2: Get single author
        if (authors.length > 0) {
            const authorId = authors[0].id;
            console.log(`\n2. Calling authorsService.getById(${authorId})...`);
            const author = await authorsService.getById(authorId);

            console.log('✅ Received author:', author);
            console.log('   ID:', author.id);
            console.log('   Name:', author.name);
            console.log('   Biography:', author.biography);
            console.log('   Avatar URL:', author.avatarUrl);
        }

        console.log('\n=== All tests passed! ===');
        return true;

    } catch (error) {
        console.error('❌ Test failed:', error);
        return false;
    }
};

/**
 * Example: Using the service in a component
 */
export const AuthorsListExample = () => {
    const [authors, setAuthors] = React.useState<Author[]>([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchAuthors = async () => {
            try {
                setLoading(true);

                // This will receive the actual Author[] array
                const data = await authorsService.getAll();

                console.log('Authors received in component:', data);
                setAuthors(data);
            } catch (err) {
                console.error('Error fetching authors:', err);
                setError(err instanceof Error ? err.message : 'Failed to load authors');
            } finally {
                setLoading(false);
            }
        };

        fetchAuthors();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>Authors ({authors.length})</h2>
            <ul>
                {authors.map(author => (
                    <li key={author.id}>
                        <strong>{author.name}</strong>
                        {author.avatarUrl && (
                            <img src={author.avatarUrl} alt={author.name} />
                        )}
                        <p>{author.biography}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

/**
 * Response Type Flow:
 * 
 * apiClient.get<ApiResponse<Author[]>>(endpoint)
 *   ↓ (axios makes HTTP request)
 * HTTP Response: { data: { code: 200, message: "Success", data: [...] } }
 *   ↓ (response interceptor)
 * Returns: { code: 200, message: "Success", data: [...] } (ApiResponse<Author[]>)
 *   ↓ (service method)
 * return response.data
 *   ↓ (component)
 * Author[] (the actual array)
 */
