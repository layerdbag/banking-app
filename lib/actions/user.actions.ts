'use server';
import { createSessionClient, createAdminClient } from '@/lib/appwrite'
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ID, Query } from 'node-appwrite';
import { parseStringify } from '../utils';

const {
  APPWRITE_DATABASE_ID: DATABASE_ID,
  APPWRITE_USER_COLLECTION: USER_COLLECTION_ID,
  APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID!,
      USER_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )

    return parseStringify(user.documents[0]);
  } catch (e) {
    console.error(e)
  }
}

export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / Database / Make fetch
    const { account } = await createAdminClient();

    const session = await account.
      createEmailPasswordSession(email, password);

    cookies().set('appwrite-session', session.secret, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    });

    const user = await getUserInfo({ userId: session.userId })

    return parseStringify(user)
  } catch (e) {
    console.error('Error', e);
  }
}

export const signUp = async (userData: SignUpParams) => {
  const { email, password, firstName, lastName } = userData
  try {
    // Mutation / Database / Make fetch
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`
    );

    const session = await account.createEmailPasswordSession(email, password);

    cookies().set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount)
  }

  // the SignUpPage component ...
  catch (e) {
    console.error('Error', e);
  }
}


// ... your initilization functions

export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();

    const user = await account.get();

    return parseStringify(user);
  } catch (error) {
    return null;
  }
}

export async function logoutAccount() {
  try {
    const { account } = await createSessionClient();

    cookies().delete('appwrite-session');
    await account.deleteSession('current');
  } catch (e) {
    return null;
  }
}