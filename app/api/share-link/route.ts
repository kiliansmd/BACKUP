import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { appConfig } from '@/config/app.config';

// In-memory storage für Development (für Production: Redis/Database)
const shareLinks = new Map<string, {
  candidateId: string;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  maxAccess?: number;
  metadata?: {
    candidateName?: string;
    sharedBy?: string;
    ipAddress?: string;
  };
}>();

interface CreateShareLinkRequest {
  candidateId: string;
  expirationHours?: number;
  maxAccess?: number;
  metadata?: {
    candidateName?: string;
    sharedBy?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateShareLinkRequest = await request.json();
    const { candidateId, expirationHours = 72, maxAccess, metadata } = body;

    if (!candidateId) {
      return NextResponse.json(
        { error: 'Candidate ID ist erforderlich' },
        { status: 400 }
      );
    }

    // Generate secure token
    const token = randomBytes(32).toString('hex');
    const expiresAt = Date.now() + (expirationHours * 60 * 60 * 1000);
    
    // Store link data
    shareLinks.set(token, {
      candidateId,
      expiresAt,
      createdAt: Date.now(),
      accessCount: 0,
      maxAccess,
      metadata: {
        ...metadata,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
      }
    });

    // Generate shareable URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                   request.headers.get('origin') || 
                   'http://localhost:3000';
    
    const shareUrl = `${baseUrl}/share/${token}`;

    return NextResponse.json({
      success: true,
      data: {
        shareUrl,
        token,
        expiresAt,
        expirationHours,
        maxAccess,
        metadata
      }
    });

  } catch (error) {
    console.error('Error creating share link:', error);
    return NextResponse.json(
      { error: 'Fehler beim Erstellen des Share-Links' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token ist erforderlich' },
        { status: 400 }
      );
    }

    const linkData = shareLinks.get(token);
    
    if (!linkData) {
      return NextResponse.json(
        { error: 'Share-Link nicht gefunden' },
        { status: 404 }
      );
    }

    // Check expiration
    if (Date.now() > linkData.expiresAt) {
      shareLinks.delete(token);
      return NextResponse.json(
        { error: 'Share-Link ist abgelaufen' },
        { status: 410 }
      );
    }

    // Check access limits
    if (linkData.maxAccess && linkData.accessCount >= linkData.maxAccess) {
      return NextResponse.json(
        { error: 'Maximale Anzahl von Zugriffen erreicht' },
        { status: 429 }
      );
    }

    // Increment access count
    linkData.accessCount += 1;
    shareLinks.set(token, linkData);

    return NextResponse.json({
      success: true,
      data: {
        candidateId: linkData.candidateId,
        expiresAt: linkData.expiresAt,
        accessCount: linkData.accessCount,
        maxAccess: linkData.maxAccess,
        metadata: linkData.metadata
      }
    });

  } catch (error) {
    console.error('Error validating share link:', error);
    return NextResponse.json(
      { error: 'Fehler beim Validieren des Share-Links' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Token ist erforderlich' },
        { status: 400 }
      );
    }

    const exists = shareLinks.has(token);
    shareLinks.delete(token);

    return NextResponse.json({
      success: true,
      data: { deleted: exists }
    });

  } catch (error) {
    console.error('Error deleting share link:', error);
    return NextResponse.json(
      { error: 'Fehler beim Löschen des Share-Links' },
      { status: 500 }
    );
  }
} 