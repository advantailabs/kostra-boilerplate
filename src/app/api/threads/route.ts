// Using standardized response helpers
import {
  internalServerErrorResponse,
  successResponse,
  unauthorizedResponse,
} from '@/lib/utils/response';

import { getAuthUser } from '@/lib/auth/jwt';
import { getUserThreadsPaginated } from '@/services/internal/chat';
import { NextRequest } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');
    const limit = Math.max(1, Math.min(100, limitParam ? parseInt(limitParam, 10) : 15));
    const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10)) : 0;

    const authUser = await getAuthUser(request);

    if (!authUser) {
      return unauthorizedResponse();
    }

    // Get user's threads (paginated by default; default limit 15)
    const result = await getUserThreadsPaginated(authUser.userId, limit, offset);

    if (!result.success) {
      return internalServerErrorResponse(result.error);
    }

    return successResponse({
      threads: result.data,
      pagination: {
        limit,
        offset,
        hasMore: (result.data?.length || 0) === limit,
      },
      message: 'Threads retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return internalServerErrorResponse();
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const { userId: clerkUserId } = await auth();

//     if (!clerkUserId) {
//       return NextResponse.json(
//         { error: 'Unauthorized', message: 'Authentication required' },
//         { status: 401 }
//       );
//     }

//     // Get user from database
//     const user = await getUserByClerkId(clerkUserId);
//     if (!user) {
//       return NextResponse.json(
//         { error: 'User not found', message: 'User does not exist' },
//         { status: 404 }
//       );
//     }

//     // Parse and validate request body
//     const body = await request.json();
//     const validationResult = createThreadSchema.safeParse(body);

//     if (!validationResult.success) {
//       return NextResponse.json(
//         {
//           error: 'Validation failed',
//           message: 'Invalid input data',
//           details: validationResult.error.issues.map((err: any) => ({
//             field: err.path.join('.'),
//             message: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }

//     const { personaId, message } = validationResult.data;

//     // Create thread with first message (lazy creation)
//     const result = await createThreadWithMessage(user.id, personaId, message);

//     if (!result.success) {
//       return NextResponse.json(
//         { error: 'Failed to create thread', message: result.error },
//         { status: result.error?.includes('not found') ? 404 : 500 }
//       );
//     }

//     return NextResponse.json(
//       {
//         thread: result.data,
//         message: 'Thread created successfully',
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Error creating thread:', error);
//     return NextResponse.json(
//       { error: 'Internal server error', message: 'An unexpected error occurred' },
//       { status: 500 }
//     );
//   }
// }
