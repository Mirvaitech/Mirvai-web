import React from 'react';
import {
  categoryLabel,
  formatCardLocation,
  formatListingPrice,
  HomeListing,
  resolveListingImage,
  truncateDescription,
} from '../lib/courtyardReview';

interface PropertyCardProps {
  item: HomeListing;
  isExpanded: boolean;
  onToggleExpand: (id: string) => void;
  onOpenProperty: (id: string) => void;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  item,
  isExpanded,
  onToggleExpand,
  onOpenProperty,
  compact = false,
}) => {
  const art = resolveListingImage(item);
  const badgeText =
    !item.status || item.status === 'Available'
      ? 'FOR SALE'
      : item.status.toUpperCase();
  const { preview, truncated } = truncateDescription(
    item.description,
    compact ? 46 : 66
  );
  const features = (item.features || []).slice(0, 4);

  return (
    <article className={`luxury-card ${compact ? 'is-compact' : ''}`}>
      <div className="luxury-card-media-wrap">
        <button
          type="button"
          className="luxury-card-media"
          aria-label={`View ${item.name}`}
          onClick={() => onOpenProperty(item.id)}
        >
          {art ? (
            <img
              loading="lazy"
              src={art.src}
              alt={art.alt}
              width={1050}
              height={700}
            />
          ) : (
            <span className="image-placeholder">
              <svg aria-hidden="true">
                <use href="#i-home" />
              </svg>{' '}
              Property preview
            </span>
          )}
          <span className="luxury-card-status">{badgeText}</span>
        </button>
      </div>

      <div className="luxury-card-body">
        <p className="luxury-card-kicker">{categoryLabel(item.type).toUpperCase()}</p>

        <h3 className="luxury-card-title">
          <button type="button" onClick={() => onOpenProperty(item.id)}>
            {item.name}
          </button>
        </h3>

        <p className="luxury-card-location">{formatCardLocation(item.locale)}</p>

        <p className="luxury-card-price">
          {formatListingPrice(item.price, item.currency)}
        </p>

        <div className="luxury-card-desc">
          <p>
            {isExpanded || !truncated ? item.description : preview}{' '}
            <button
              type="button"
              className="luxury-card-desc-link"
              aria-expanded={isExpanded}
              onClick={() => onToggleExpand(item.id)}
            >
              {isExpanded ? 'Show less' : 'View full description'}
            </button>
          </p>
        </div>

        {features.length > 0 && (
          <ul className="luxury-card-features" aria-label="Property highlights">
            {features.map((feat, idx) => (
              <li key={`${item.id}-feat-${idx}`}>{feat}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          className="luxury-card-cta"
          onClick={() => onOpenProperty(item.id)}
        >
          View Details
        </button>
      </div>
    </article>
  );
};
