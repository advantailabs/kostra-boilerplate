import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

import { getUserThreads } from '@/services/internal/chat';
import { getUserByClerkId } from '@/services/repositories/user';

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await getUserByClerkId(clerkUserId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', message: 'User does not exist' },
        { status: 404 }
      );
    }

    // Get user's threads
    const result = await getUserThreads(user.id);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to fetch threads', message: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      threads: result.data,
      message: 'Threads retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching threads:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: 'An unexpected error occurred' },
      { status: 500 }
    );
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
